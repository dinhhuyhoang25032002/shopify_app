import ShopModel from '../models/shop.model.js';
import shopify from '../shopify.js';
export const addNewShop = async (_req, res, next) => {

  try {
    const session = res.locals.shopify.session;
    const client = new shopify.api.clients.Graphql({ session });
    const data = await client.query({
      data: {
        "query": `
          query shopAccountOwner {
            shop {
              myshopifyDomain
              name
             
              email
              plan {
                displayName
              }
              
            }
          }
        `
      },
    });
    console.log('checkdata owner store', data.body.data.shop, { depth: null });
    const shopData = await ShopModel.findOne({
      where: {
        shop: session.shop,
      }
    })
    if (!shopData) {
      await ShopModel.create({
        token: session.accessToken,
        email: data.body.data.shop.email,
        sender_email: "hoangdinh2593@gmail.com",
        shop: session.shop,
        first_name: data.body.data.shop.name,
        last_name: data.body.data.shop.plan.displayName,
      });
    }
    // Lưu thông tin shop vào DB (sau này)
    next(); // chuyển sang middleware tiếp theo (redirectToShopifyOrAppRoot)
  } catch (err) {
    console.error("❌ Error saving shop:", err);
    res.status(500).send("OAuth processing error");
  }
};