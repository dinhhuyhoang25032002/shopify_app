import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import Koa from 'koa';

export const validateBody = (dtoClass: any) => {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    const instance = plainToInstance(dtoClass, ctx.request.body) as any;
    const errors = await validate(instance);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors.map(e => ({
        property: e.property,
        constraints: e.constraints,
      }));
      return;
    }

    // Ensure body is clean and matches DTO
    ctx.request.body = { ...instance };
    await next();
  };
};
