import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../enums/role.enum';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    countryId?: string,
    userRole?: Role,
    userCountryId?: string
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    // Apply country filter for MANAGER and MEMBER
    if (userRole !== Role.ADMIN && userCountryId) {
      where.countryId = userCountryId;
    } else if (countryId) {
      where.countryId = countryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [restaurants, total] = await Promise.all([
      this.prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
        include: {
          country: true,
          _count: {
            select: { menuItems: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.restaurant.count({ where }),
    ]);

    return {
      data: restaurants,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userRole?: Role, userCountryId?: string) {
    const where: any = { id };

    // Apply country filter for MANAGER and MEMBER
    if (userRole !== Role.ADMIN && userCountryId) {
      where.countryId = userCountryId;
    }

    const restaurant = await this.prisma.restaurant.findFirst({
      where,
      include: {
        country: true,
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  async findMenuItems(restaurantId: string, userRole?: Role, userCountryId?: string) {
    // First verify restaurant exists and user has access
    const restaurant = await this.findOne(restaurantId, userRole, userCountryId);

    return this.prisma.menuItem.findMany({
      where: {
        restaurantId: restaurant.id,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

