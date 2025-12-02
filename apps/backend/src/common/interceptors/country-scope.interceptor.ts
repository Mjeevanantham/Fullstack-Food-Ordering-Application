import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '../enums/role.enum';

@Injectable()
export class CountryScopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Admin bypasses country scoping
    if (user && user.role === Role.ADMIN) {
      return next.handle();
    }

    // For MANAGER and MEMBER, attach country filter to request
    if (user && user.countryId) {
      request.countryFilter = { countryId: user.countryId };
    }

    return next.handle();
  }
}

