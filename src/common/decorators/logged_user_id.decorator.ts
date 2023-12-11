import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@app/auth/strategies';

export const GetCurrentUserId = createParamDecorator(
  (data: keyof JwtPayload | undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return +user?.sub;
  },
);
