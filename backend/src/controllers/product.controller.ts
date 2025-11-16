import { handleGetProducts } from '@/services/product.service';
import { Context } from 'koa';

export const getProducts = async (ctx: Context) => {
  try {
    const user = ctx.state.user;
    const tags = ctx.query.tags;

    const products = await handleGetProducts(user, tags);

    ctx.status = 200;
    ctx.body = products;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = 'Error fetching products';
  }
};
