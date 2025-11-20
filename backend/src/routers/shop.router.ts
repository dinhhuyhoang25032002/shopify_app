import Router from '@koa/router'
import { getShopInfo, createShop, updateShopInfo, deleteShop } from 'src/controllers/shop.controller'
const router = new Router({
  prefix: '/shop'
})

// GET
router.get('/', getShopInfo)

//POST
router.post('/', createShop)

//PATCH
router.patch('/:id', updateShopInfo)

// DELETE
router.delete('/:id', deleteShop)

export default router
