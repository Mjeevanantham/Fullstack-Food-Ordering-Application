import { Module, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CountriesModule } from './countries/countries.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { AbilityModule } from './common/ability/ability.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CountryScopeInterceptor } from './common/interceptors/country-scope.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AbilityModule,
    AuthModule,
    UsersModule,
    CountriesModule,
    RestaurantsModule,
    OrdersModule,
    PaymentsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CountryScopeInterceptor,
    },
  ],
})
export class AppModule {}

