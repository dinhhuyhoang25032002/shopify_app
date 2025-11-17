import Router from '@koa/router';
import { getProductTag } from 'src/controllers/product-tag.controller';

const router = new Router({
  prefix: '/product-tag',
});

// GET
router.get('/', getProductTag);

export default router;
