import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '../common/enums/order-status.enum';
import { Role } from '../enums/role.enum';
import { PaymentsService } from '../payments/payments.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private paymentsService: PaymentsService
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    // Verify restaurant exists
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: createOrderDto.restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Fetch menu items and calculate total
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: createOrderDto.items.map((item) => item.menuItemId) },
        restaurantId: createOrderDto.restaurantId,
      },
    });

    if (menuItems.length !== createOrderDto.items.length) {
      throw new BadRequestException('Some menu items not found');
    }

    let totalAmount = 0;
    const orderItems = createOrderDto.items.map((item) => {
      const menuItem = menuItems.find((mi) => mi.id === item.menuItemId);
      if (!menuItem) {
        throw new BadRequestException(`Menu item ${item.menuItemId} not found`);
      }
      const price = Number(menuItem.price) * item.quantity;
      totalAmount += price;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
      };
    });

    // Create order with order items
    const order = await this.prisma.order.create({
      data: {
        userId,
        restaurantId: createOrderDto.restaurantId,
        status: OrderStatus.PENDING,
        totalAmount,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        restaurant: {
          include: { country: true },
        },
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return order;
  }

  async findAll(userId: string, userRole: Role, userCountryId?: string) {
    const where: any = {};

    // Apply country filter for MANAGER and MEMBER
    if (userRole !== Role.ADMIN) {
      if (userRole === Role.MEMBER) {
        // Members can only see their own orders
        where.userId = userId;
      } else if (userRole === Role.MANAGER && userCountryId) {
        // Managers see orders from restaurants in their country
        where.restaurant = {
          countryId: userCountryId,
        };
      }
    }

    return this.prisma.order.findMany({
      where,
      include: {
        restaurant: {
          include: { country: true },
        },
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, userRole: Role, userCountryId?: string) {
    const where: any = { id };

    // Apply country filter for MANAGER and MEMBER
    if (userRole !== Role.ADMIN) {
      if (userRole === Role.MEMBER) {
        where.userId = userId;
      } else if (userRole === Role.MANAGER && userCountryId) {
        where.restaurant = {
          countryId: userCountryId,
        };
      }
    }

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        restaurant: {
          include: { country: true },
        },
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async checkout(id: string, userId: string, userRole: Role) {
    const order = await this.findOne(id, userId, userRole);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order cannot be checked out');
    }

    // Simulate Stripe payment
    const paymentIntent = await this.paymentsService.createPaymentIntent(
      Number(order.totalAmount),
      order.id
    );

    // Update order status
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CONFIRMED,
      },
      include: {
        restaurant: {
          include: { country: true },
        },
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return {
      order: updatedOrder,
      paymentIntent,
    };
  }

  async cancel(id: string, userId: string, userRole: Role) {
    const order = await this.findOne(id, userId, userRole);

    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order cannot be cancelled');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CANCELLED,
      },
      include: {
        restaurant: {
          include: { country: true },
        },
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  }
}

