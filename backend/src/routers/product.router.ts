import Router from '@koa/router';
import { getProducts } from 'src/controllers/product.controller';
const router = new Router({
  prefix: '/products',
});

// GET
router.get('/', getProducts);

export default router;
