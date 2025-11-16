import { getProductTag } from '@/controllers/product-tag.controller';
import Router from '@koa/router';

const router = new Router({
  prefix: '/product-tag',
});

// GET
router.get('/', getProductTag);

export default router;
