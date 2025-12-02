import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentMethodType } from '../common/enums/payment-method-type.enum';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeSecretKey) {
      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2024-02-20.acacia',
      });
    }
  }

  async createPaymentIntent(amount: number, orderId: string) {
    if (!this.stripe) {
      // Mock payment intent for development without Stripe keys
      return {
        id: `pi_mock_${Date.now()}`,
        client_secret: `pi_mock_${Date.now()}_secret`,
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        status: 'succeeded',
        orderId,
      };
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId,
      },
    });

    return {
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      orderId,
    };
  }

  async getPaymentMethods(userId: string) {
    return this.prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPaymentMethod(userId: string, createDto: CreatePaymentMethodDto) {
    return this.prisma.paymentMethod.create({
      data: {
        userId,
        type: createDto.type,
        last4: createDto.last4,
        brand: createDto.brand,
      },
    });
  }

  async createPaymentMethodForUser(
    targetUserId: string,
    createDto: CreatePaymentMethodDto
  ) {
    return this.prisma.paymentMethod.create({
      data: {
        userId: targetUserId,
        type: createDto.type,
        last4: createDto.last4,
        brand: createDto.brand,
      },
    });
  }
}

