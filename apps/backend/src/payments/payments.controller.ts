import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CaslGuard } from '../common/guards/casl.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CheckAbility } from '../common/decorators/check-ability.decorator';
import { Action, Subject } from '../common/enums/ability.enum';
import { Role } from '../enums/role.enum';

@ApiTags('payments')
@Controller('users')
@UseGuards(JwtAuthGuard, CaslGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get(':id/payment-methods')
  @CheckAbility(Action.Read, Subject.PaymentMethod)
  @ApiOperation({ summary: 'Get payment methods for a user' })
  async getPaymentMethods(@Param('id') id: string, @CurrentUser() user: any) {
    // Users can view their own payment methods, admins can view anyone's
    if (user.role !== Role.ADMIN && user.id !== id) {
      throw new Error('Unauthorized');
    }
    return this.paymentsService.getPaymentMethods(id);
  }

  @Post(':id/payment-methods')
  @CheckAbility(Action.Create, Subject.PaymentMethod)
  @ApiOperation({ summary: 'Create payment method (ADMIN only for others)' })
  async createPaymentMethod(
    @Param('id') id: string,
    @Body() createDto: CreatePaymentMethodDto,
    @CurrentUser() user: any
  ) {
    // Only admin can create payment methods for other users
    if (user.role === Role.ADMIN) {
      return this.paymentsService.createPaymentMethodForUser(id, createDto);
    }
    // Users can create their own payment methods
    if (user.id === id) {
      return this.paymentsService.createPaymentMethod(user.id, createDto);
    }
    throw new ForbiddenException('Unauthorized');
  }
}

