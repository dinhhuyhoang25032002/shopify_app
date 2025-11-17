import Router from '@koa/router'
import { getProducts, getProductTag } from '@/controllers/product.controller'
const router = new Router({
  prefix: '/products'
})

// GET
router.get('/', getProducts)
router.get('/tags', getProductTag)
export default router
