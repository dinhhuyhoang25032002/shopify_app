import { updateShopInfoWh, updateShopStatusWh } from '@/controllers/webhook.controller'
import Router from '@koa/router'

const router = new Router({
  prefix: '/webhooks'
})

router.post('/app/uninstalled', updateShopStatusWh)

router.post('/shop/update', updateShopInfoWh)

export default router
