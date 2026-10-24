import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProcessPaymentDto } from './dto/payment.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async processPayment(userId: string, dto: ProcessPaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Cannot pay for an order not associated with your account');
    }

    const txId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (dto.outcome === 'SUCCESS') {
      await this.prisma.$transaction([
        this.prisma.payment.create({
          data: {
            orderId: order.id,
            amount: order.totalAmount,
            status: PaymentStatus.SUCCESSFUL,
            transactionId: txId,
            provider: 'MOCK_SANDBOX',
          },
        }),
        this.prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: PaymentStatus.SUCCESSFUL,
            status: OrderStatus.CONFIRMED,
          },
        }),
      ]);

      return {
        orderId: order.id,
        paymentStatus: 'SUCCESSFUL',
        transactionId: txId,
        message: 'Payment verified and confirmed by server',
      };
    } else if (dto.outcome === 'FAILED') {
      await this.prisma.payment.create({
        data: {
          orderId: order.id,
          amount: order.totalAmount,
          status: PaymentStatus.FAILED,
          transactionId: txId,
          provider: 'MOCK_SANDBOX',
        },
      });

      await this.prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: PaymentStatus.FAILED },
      });

      return {
        orderId: order.id,
        paymentStatus: 'FAILED',
        transactionId: txId,
        message: 'Payment declined by mock gateway',
      };
    } else {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: PaymentStatus.CANCELLED },
      });

      return {
        orderId: order.id,
        paymentStatus: 'CANCELLED',
        transactionId: null,
        message: 'Transaction cancelled',
      };
    }
  }
}
