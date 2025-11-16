import { ShopDto } from '@/dto/shop.dto';
import { deleteShopById, handleCreateShop, handleUpdateShopInfo } from '@/services/shop.service';
import { Context } from 'koa';
export const getShopInfo = (ctx: Context) => {
  try {
    const shopData = ctx.state.user.shop;
    if (!shopData) {
      ctx.status = 404;
      ctx.body = 'Shop not found';
      return;
    }
    delete shopData.token;
    ctx.body = shopData;
    ctx.status = 200;
  } catch (error) {
    ctx.status = 500;
    ctx.body = 'Error updating shop info';
    throw new Error('Error fetching shop info');
  }
};
export const createShop = async (ctx: Context) => {
  try {
    const body = ctx.request.body as any as ShopDto;
    if (!body) {
      ctx.status = 400;
      ctx.body = 'Invalid request body';
      return;
    }
    const result = await handleCreateShop(body);
    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = 'Error updating shop info';
  }
};
export const updateShopInfo = async (ctx: Context) => {
  try {
    const shopId = ctx.params.id;
    const body = ctx.request.body as Partial<ShopDto>;

    const success = await handleUpdateShopInfo(shopId, body);

    if (success) {
      ctx.status = 200;
      ctx.body = 'Shop info updated successfully';
    } else {
      ctx.status = 404;
      ctx.body = 'Shop not found or no changes!';
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = 'Error updating shop info';
  }
};
export const deleteShop = async (ctx: Context) => {
  try {
    const shopId = ctx.params.id;

    const success = await deleteShopById(shopId);

    if (success) {
      ctx.status = 200;
      ctx.body = 'Shop deleted successfully';
    } else {
      ctx.status = 404;
      ctx.body = 'Shop not found';
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = 'Error deleting shop';
  }
};
