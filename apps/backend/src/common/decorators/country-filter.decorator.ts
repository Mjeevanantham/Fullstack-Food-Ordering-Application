import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CountryFilter = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.countryFilter || {};
  }
);

