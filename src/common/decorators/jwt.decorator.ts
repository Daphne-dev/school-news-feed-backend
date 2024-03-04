import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { JwtPayload, RefreshJwtPayload } from '../jwt/jwt-utility.interface';

export const UserInfo = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request & { user: JwtPayload }>();
  const payload = request.user;
  return { ...(payload ?? null) };
});

export const RefreshJwtInfo = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request & { user: RefreshJwtPayload }>();
  const payload = request.user;
  return { ...(payload ?? null) };
});
