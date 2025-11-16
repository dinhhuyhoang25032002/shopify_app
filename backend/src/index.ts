import 'tsconfig-paths/register';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from '@koa/router';
import cors from '@koa/cors';
import passport from '@/guards/passport-jwt';
import '@/models/index';

import { generateToken } from './util/generate-jwt';
import shopRouter from './routers/shop.router';

import { corsOptios } from '@/constants/index';
import sequelize from '@/database';
const app = new Koa();
const router = new Router({
  prefix: '/api',
});
app.use(cors(corsOptios));
app.use(
  koaBody({
    multipart: true,
    json: true,
    urlencoded: true,
  }),
);
app.use(passport.initialize());
app.use(passport.authenticate('jwt', { session: false }));

//SHOP ROUTERS
router.use(shopRouter.routes()).use(shopRouter.allowedMethods());

//ROLE ROUTERS

//PRODUCT ROUTERS

//PRODUCT TAG ROUTERS

app.use(router.routes()).use(router.allowedMethods());

console.log(generateToken());
// (async () => {
//   try {
//     await sequelize.authenticate();
//     // await sequelize.sync({ alter: true });
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// })();

app.listen(4000);
