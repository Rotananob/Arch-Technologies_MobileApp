import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    // 1. Fetch user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your shopping cart is empty');
    }

    // 2. Perform transactional order creation with inventory decrement
    return this.prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData: any[] = [];

      for (const item of cart.items) {
        // Fetch current product to check real-time stock
        const currentProd = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!currentProd || currentProd.stockQuantity < item.quantity) {
          throw new BadRequestException(
            `Product "${item.product.title}" has insufficient stock available`,
          );
        }

        // Authoritative server-side price calculation
        const itemTotal = currentProd.price * item.quantity;
        subtotal += itemTotal;

        orderItemsData.push({
          productId: currentProd.id,
          unitPrice: currentProd.price,
          quantity: item.quantity,
        });

        // Decrement inventory atomically
        await tx.product.update({
          where: { id: currentProd.id },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        });
      }

      const deliveryFee = 2.0;
      const totalAmount = Math.round((subtotal + deliveryFee) * 100) / 100;

      // Create Address
      const address = await tx.address.create({
        data: {
          userId,
          recipientName: dto.recipientName,
          phoneNumber: dto.phoneNumber,
          streetAddress: dto.streetAddress,
          city: dto.city,
          campusBuilding: dto.campusBuilding,
        },
      });

      // Generate order number
      const orderNumber = `SS-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      // Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: address.id,
          subtotal: Math.round(subtotal * 100) / 100,
          deliveryFee,
          totalAmount,
          status: OrderStatus.PENDING,
          paymentMethod: (dto.paymentMethod as PaymentMethod) || PaymentMethod.MOCK_PAYMENT,
          paymentStatus: PaymentStatus.PENDING,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: { include: { product: true } },
          shippingAddress: true,
        },
      });

      // Clear user cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return this.formatOrder(order);
    });
  }

  async findMyOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true } } },
            },
          },
        },
        shippingAddress: true,
      },
    });

    return orders.map((o) => this.formatOrder(o));
  }

  async findOne(orderId: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true } } },
            },
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('Access to this order is denied');
    }

    return this.formatOrder(order);
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Cannot cancel orders that do not belong to you');
    }

    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Order cannot be cancelled in its current state');
    }

    // Transaction to update status and restore stock
    return this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity } },
        });
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
          paymentStatus: PaymentStatus.CANCELLED,
        },
        include: {
          items: { include: { product: true } },
          shippingAddress: true,
        },
      });

      return this.formatOrder(updated);
    });
  }

  private formatOrder(o: any) {
    return {
      id: o.id,
      orderNumber: o.orderNumber,
      userId: o.userId,
      items: o.items.map((i: any) => ({
        id: i.id,
        productId: i.productId,
        productTitle: i.product?.title || 'Product',
        imageUrl: i.product?.images?.[0]?.imageUrl || null,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        sellerId: i.product?.sellerId || '',
      })),
      subtotal: o.subtotal,
      deliveryFee: o.deliveryFee,
      totalAmount: o.totalAmount,
      recipientName: o.shippingAddress?.recipientName || '',
      phoneNumber: o.shippingAddress?.phoneNumber || '',
      streetAddress: o.shippingAddress?.streetAddress || '',
      city: o.shippingAddress?.city || '',
      campusBuilding: o.shippingAddress?.campusBuilding || null,
      status: o.status,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      createdAt: o.createdAt.toISOString(),
    };
  }
}
