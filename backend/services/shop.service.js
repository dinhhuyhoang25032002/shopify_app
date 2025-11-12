import ShopModel from "../models/shop.model.js";
export const getShopInfo = async (ctx) => {
  try {
    const shopData = ctx.state.user.shop;
    if (!shopData) {
      ctx.status = 404;
      ctx.body = "Shop not found";
      return;
    }
    delete shopData.token
    ctx.body = shopData;
    ctx.status = 200;
  } catch (err) {
    console.error("❌ Error fetching shop info:", err);
    ctx.status = 500;
    ctx.body = "Error fetching shop info";
  }
}
export const updateShopInfo = async (ctx) => {
  try {
    const body = ctx.request.body;
    const shopId = ctx.params.id;
    console.log(body);

    const [result] = await ShopModel.update(body, {
      where: { shop: shopId }
    });
    console.log(result);
    if (result !== 0) {
      ctx.status = 200;
      ctx.body = "Shop info updated successfully";
      return
    }
    ctx.status = 404;
    ctx.body = "Store not found or no changes!";
  } catch (error) {
    ctx.status = 500;
    ctx.body = "Error updating shop info";
    console.log(error);

  }
}

export const createShop = async (ctx) => {
  try {
    const body = ctx.request.body;
    const newShop = await ShopModel.create(body,
      { raw: true }
    );
    ctx.status = 201;
    ctx.body = newShop;
  } catch (error) {
    ctx.status = 500;
    ctx.body = "Error creating shop";
    console.log(error);
  }
}

export const deleteShop = async (ctx) => {
  try {
    const shopId = ctx.params.id;
    const result = await ShopModel.destroy({
      where: { shop: shopId }
    });
    if (result !== 0) {
      ctx.status = 200;
      ctx.body = "Shop deleted successfully";
      return;
    }
    ctx.status = 404;
    ctx.body = "Shop not found";
  }
  catch (error) {
    ctx.status = 500;
    ctx.body = "Error deleting shop";
    console.log(error);
  }
}