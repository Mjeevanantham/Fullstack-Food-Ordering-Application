import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_ABILITY_KEY, CheckAbilityOptions } from '../decorators/check-ability.decorator';
import { AbilityFactory } from '../ability/ability.factory';
import { AppAbility } from '../ability/ability.factory';

@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<CheckAbilityOptions>(
      CHECK_ABILITY_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const ability = this.abilityFactory.createForUser(user);

    const canActivate = ability.can(requiredPermissions.action, requiredPermissions.subject);

    if (!canActivate) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Attach ability to request for use in controllers/services
    request.ability = ability;

    return true;
  }
}

