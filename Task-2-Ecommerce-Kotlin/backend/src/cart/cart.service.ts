import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: { select: { id: true, fullName: true } },
                images: { where: { isPrimary: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  seller: { select: { id: true, fullName: true } },
                  images: { where: { isPrimary: true } },
                },
              },
            },
          },
        },
      });
    }

    const items = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productTitle: item.product.title,
      productTitleKh: item.product.titleKh,
      unitPrice: item.product.price,
      imageUrl: item.product.images[0]?.imageUrl || null,
      quantity: item.quantity,
      maxAvailableStock: item.product.stockQuantity,
      sellerId: item.product.sellerId,
      sellerName: item.product.seller?.fullName || 'Seller',
    }));

    const subtotal = items.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0);
    const deliveryFee = items.length > 0 ? 2.0 : 0.0;
    const total = subtotal + deliveryFee;

    return {
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      deliveryFee,
      total: Math.round(total * 100) / 100,
    };
  }

  async addItem(userId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stockQuantity < dto.quantity) {
      throw new BadRequestException('Requested quantity exceeds available stock');
    }

    // Get or create cart
    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }

    // Check existing item in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: dto.productId,
        },
      },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + dto.quantity;
      if (product.stockQuantity < newQty) {
        throw new BadRequestException('Cannot add more than available stock');
      }
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
        },
      });
    }

    return this.getOrCreateCart(userId);
  }

  async updateItemQuantity(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (item.product.stockQuantity < dto.quantity) {
      throw new BadRequestException('Quantity exceeds current available stock');
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });

    return this.getOrCreateCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { id: itemId },
    });
    return this.getOrCreateCart(userId);
  }
}
