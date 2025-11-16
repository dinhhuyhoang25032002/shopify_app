import { getProducts } from '@/controllers/product.controller';
import Router from '@koa/router';
const router = new Router({
  prefix: '/products',
});

// GET
router.get('/', getProducts);

export default router;
