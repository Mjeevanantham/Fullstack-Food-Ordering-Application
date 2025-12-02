import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppAbility } from '../ability/ability.factory';

export const CurrentAbility = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AppAbility => {
    const request = ctx.switchToHttp().getRequest();
    return request.ability;
  }
);

