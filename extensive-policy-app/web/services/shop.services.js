import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import shopify from '../shopify.js';
dotenv.config();

export const afterAuth = async (_req, res, next) => {
  const SECRET_KEY = process.env.SHOPIFY_API_SECRET || "super-secret-key";
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

  const payload = {
    email: data.body.data.shop.email,
    sender_email: data.body.data.shop.email,
    shop: session.shop,
    first_name: data.body.data.shop.name,
  }
  const jwtToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
  try {
    await fetch(`https://untenuous-li-frothily.ngrok-free.dev/api/shop`, {
      method: "POST",
      body: JSON.stringify({
        token: session.accessToken,
        email: data.body.data.shop.email,
        sender_email: data.body.data.shop.email,
        shop: session.shop,
        first_name: data.body.data.shop.name,
      }),
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json'
      }
    })
    next(); // chuyển sang middleware tiếp theo (redirectToShopifyOrAppRoot)
  } catch (err) {
    console.error("❌ Error saving shop:", err);
    res.status(500).send("OAuth processing error");
  }
};