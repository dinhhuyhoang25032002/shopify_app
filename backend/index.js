import Koa from "koa";
import koaBody from "koa-body";
import Router from '@koa/router'
import sequelize from "./db.js";
import { getShopInfo, updateShopInfo, createShop, deleteShop } from "./services/shop.service.js";
import cors from '@koa/cors'
import passport from './guards/passport-jwt.js'
import './models/index.js'
import { generateToken } from "./helper/generate-jwt.js";
import { createRole, duplicateRole, updateRole, deleteRole, getRole, getRoles, getRolesBySearch } from "./services/role.service.js";
import { GetProducts } from "./services/product.service.js";
import { getProductTag } from "./services/product_tag.service.js";

const app = new Koa();
const router = new Router({
    prefix: '/api'
}
);
app.use(cors({
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ['content-type', 'Authorization', 'Origin', 'Access-Control-Allow-Origin', 'Accept', 'Options', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.use(koaBody());
app.use(passport.initialize());
app.use(
    passport.authenticate("jwt", { session: false })
);

//SHOP ROUTERS
router.get('/shop', async (ctx) => getShopInfo(ctx))
router.patch('/shop/:id', async (ctx) => updateShopInfo(ctx));
router.post('/shop', async (ctx) => createShop(ctx));
router.delete('/shop/:id', async (ctx) => deleteShop(ctx));

//ROLE ROUTERS
router.post('/role', async (ctx) => createRole(ctx));
router.post('/role/:id', async (ctx) => duplicateRole(ctx));

router.get('/roles/search', async (ctx) => getRolesBySearch(ctx));
router.get('/roles/:id', async (ctx) => getRole(ctx));
router.get('/roles', async (ctx) => getRoles(ctx));

router.put('/role/:id', async (ctx) => updateRole(ctx));
router.delete('/role/:id', async (ctx) => deleteRole(ctx));

//PRODUCT ROUTERS
router.get('/products', async (ctx) => GetProducts(ctx))

//PRODUCT TAG ROUTERS
router.get('/product-tag', async (ctx) => getProductTag(ctx))

app
    .use(router.routes())
    .use(router.allowedMethods());
(async () => {
    try {
        await sequelize.authenticate();
        //await sequelize.sync();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})()
console.log(generateToken());

app.listen(4000);