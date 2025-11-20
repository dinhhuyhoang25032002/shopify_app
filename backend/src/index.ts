import Koa from 'koa'
import koaBody from 'koa-body'
import Router from '@koa/router'
import cors from '@koa/cors'
import passport from './guards/passportJwt'
import 'src/models/index'
import { generateToken } from '@/util/generateJwt'
import shopRouter from 'src/routers/shop.router'
import ruleRouter from 'src/routers/rule.router'
import productRouter from 'src/routers/product.router'
import webhookRouter from 'src/routers/webhook.router'
import sequelize from 'src/database/index'
import { authGuard } from './middleware/ignoreRouter'
import { shopifyWebhookVerifier } from './middleware/verifyWebhook'

const app = new Koa()
const router = new Router({
  prefix: '/api'
})
app.use(
  cors({
    origin: '*',
    exposeHeaders: ['Authorization'],
    credentials: true
  })
)
// Middleware verify webhook đứng trước koa-body

// Body parser cho các route không phải webhook
app.use(koaBody({ json: true, includeUnparsed: true }))
app.use(shopifyWebhookVerifier)
app.use(passport.initialize())
app.use(authGuard)

//SHOP ROUTERS
router.use(shopRouter.routes()).use(shopRouter.allowedMethods())

//RULE ROUTERS
router.use(ruleRouter.routes()).use(ruleRouter.allowedMethods())

//PRODUCT ROUTERS
router.use(productRouter.routes()).use(productRouter.allowedMethods())

// WEBHOOK ROUTERS
router.use(webhookRouter.routes()).use(webhookRouter.allowedMethods())
app.use(router.routes()).use(router.allowedMethods())
;(async () => {
  try {
    await sequelize.authenticate()
    // await sequelize.sync({ alter: true })
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
})()
console.log(generateToken())

app.listen(4000, () => console.log('Server running on port 4000'))
