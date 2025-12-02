import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CaslGuard } from '../common/guards/casl.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CountryScopeInterceptor } from '../common/interceptors/country-scope.interceptor';
import { CheckAbility } from '../common/decorators/check-ability.decorator';
import { Action, Subject } from '../common/enums/ability.enum';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, CaslGuard)
@UseInterceptors(CountryScopeInterceptor)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @CheckAbility(Action.Create, Subject.Order)
  @ApiOperation({ summary: 'Create a new order' })
  async create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: any) {
    return this.ordersService.create(user.id, createOrderDto);
  }

  @Get()
  @CheckAbility(Action.Read, Subject.Order)
  @ApiOperation({ summary: 'Get all orders (scoped by role)' })
  async findAll(@CurrentUser() user: any) {
    return this.ordersService.findAll(user.id, user.role, user.countryId);
  }

  @Get(':id')
  @CheckAbility(Action.Read, Subject.Order)
  @ApiOperation({ summary: 'Get order by ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.findOne(id, user.id, user.role, user.countryId);
  }

  @Post(':id/checkout')
  @CheckAbility(Action.Update, Subject.Order)
  @ApiOperation({ summary: 'Checkout order (ADMIN/MANAGER only)' })
  async checkout(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.checkout(id, user.id, user.role, user.countryId);
  }

  @Post(':id/cancel')
  @CheckAbility(Action.Delete, Subject.Order)
  @ApiOperation({ summary: 'Cancel order (ADMIN/MANAGER only)' })
  async cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.cancel(id, user.id, user.role, user.countryId);
  }
}

