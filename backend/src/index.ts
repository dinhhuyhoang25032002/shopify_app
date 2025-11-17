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

import sequelize from 'src/database/index'
import { authGuard } from './middleware/ignoreRouter'
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
app.use(koaBody())
app.use(passport.initialize())
app.use(authGuard)

//SHOP ROUTERS
router.use(shopRouter.routes()).use(shopRouter.allowedMethods())

//RULE ROUTERS
router.use(ruleRouter.routes()).use(shopRouter.allowedMethods())

//PRODUCT ROUTERS
router.use(productRouter.routes()).use(shopRouter.allowedMethods())

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
