import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductCondition, ProductStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    search?: string;
    categoryId?: string;
    sortBy?: string;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { search, categoryId, sortBy, isFeatured } = params;
    const where: any = { status: ProductStatus.ACTIVE };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'price_desc') {
      orderBy = { price: 'desc' };
    }

    const products = await this.prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            fullName: true,
            sellerProfile: { select: { rating: true } },
          },
        },
        images: { orderBy: { isPrimary: 'desc' } },
      },
    });

    return products.map((p) => this.formatProduct(p));
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            fullName: true,
            sellerProfile: { select: { rating: true } },
          },
        },
        images: { orderBy: { isPrimary: 'desc' } },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.formatProduct(product);
  }

  async create(sellerId: string, dto: CreateProductDto) {
    const condition = dto.condition
      ? (dto.condition as ProductCondition)
      : ProductCondition.BRAND_NEW;

    const product = await this.prisma.product.create({
      data: {
        title: dto.title,
        titleKh: dto.titleKh,
        description: dto.description,
        descriptionKh: dto.descriptionKh,
        price: dto.price,
        categoryId: dto.categoryId,
        sellerId,
        stockQuantity: dto.stockQuantity,
        condition,
        images: {
          create: (dto.imageUrls || []).map((url, index) => ({
            imageUrl: url,
            isPrimary: index === 0,
          })),
        },
      },
      include: {
        category: true,
        seller: { select: { id: true, fullName: true, sellerProfile: true } },
        images: true,
      },
    });

    return this.formatProduct(product);
  }

  async delete(productId: string, userId: string, role: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.sellerId !== userId && role !== 'ADMIN') {
      throw new ForbiddenException('You are not authorized to delete this listing');
    }

    await this.prisma.product.delete({ where: { id: productId } });
    return { success: true, message: 'Listing deleted' };
  }

  private formatProduct(p: any) {
    return {
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
      sellerName: p.seller?.fullName || 'Seller',
      sellerRating: p.seller?.sellerProfile?.rating || 4.9,
      images: p.images?.map((img: any) => img.imageUrl) || [],
      stockQuantity: p.stockQuantity,
      condition: p.condition,
      isFeatured: p.isFeatured,
      isPromotion: p.isPromotion,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
    };
  }
}
