import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SellerService {
  constructor(private prisma: PrismaService) {}

  async getMyListings(sellerId: string) {
    const products = await this.prisma.product.findMany({
      where: { sellerId },
      include: {
        category: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => ({
      id: p.id,
      title: p.title,
      titleKh: p.titleKh,
      description: p.description,
      descriptionKh: p.descriptionKh,
      price: p.price,
      originalPrice: p.originalPrice,
      categoryId: p.categoryId,
      categoryName: p.category?.name || '',
      sellerId: p.sellerId,
      sellerName: 'Me',
      sellerRating: 5.0,
      images: p.images.map((img) => img.imageUrl),
      stockQuantity: p.stockQuantity,
      condition: p.condition,
      isFeatured: p.isFeatured,
      isPromotion: p.isPromotion,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
    }));
  }

  async getSellerSalesOrders(sellerId: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        items: {
          some: { product: { sellerId } },
        },
      },
      include: {
        items: {
          where: { product: { sellerId } },
          include: { product: true },
        },
        shippingAddress: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      userId: o.userId,
      items: o.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        productTitle: i.product.title,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        sellerId: i.product.sellerId,
      })),
      subtotal: o.subtotal,
      deliveryFee: o.deliveryFee,
      totalAmount: o.totalAmount,
      recipientName: o.shippingAddress?.recipientName || '',
      phoneNumber: o.shippingAddress?.phoneNumber || '',
      streetAddress: o.shippingAddress?.streetAddress || '',
      city: o.shippingAddress?.city || '',
      status: o.status,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      createdAt: o.createdAt.toISOString(),
    }));
  }
}
