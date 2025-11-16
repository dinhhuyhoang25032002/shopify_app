import { handleGetProductTag } from '@/services/product_tag.service';
import { Context } from 'koa';

export const getProductTag = async (ctx: Context) => {
  try {
    const user = ctx.state.user; // giả sử user được lưu trong state từ auth middleware

    const tags = await handleGetProductTag(user);

    ctx.status = 200;
    ctx.body = tags;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = 'Error fetching product tags';
  }
};
