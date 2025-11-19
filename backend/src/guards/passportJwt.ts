import passport from 'koa-passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { ShopModel } from 'src/models/shop.model'
import dotenv from 'dotenv'
dotenv.config()
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy token từ header Authorization: Bearer <token>
  secretOrKey: process.env.SHOPIFY_API_SECRET || 'your_secret_key' // Secret dùng để verify token
}

// Middleware xác thực
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const domain = new URL(jwt_payload.dest).hostname
      const shop = await ShopModel.findOne({
        where: { shop: domain },
        raw: true
      })
      const version = '2025-07'
      // 🔹 Nếu bạn có DB user:
      // const user = await User.findByPk(jwt_payload.id);
      if (shop) {
        const iss = jwt_payload.iss
        const url = `${iss}/api/${version}/graphql.json`
        return done(null, { ...jwt_payload, shop, url })
      } else return done(null, false)
      // 🔹 Nếu không có DB, chấp nhận luôn:
      // return done(null, jwt_payload);
    } catch (err) {
      return done(err, false)
    }
  })
)

export default passport
