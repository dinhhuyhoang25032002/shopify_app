import { handleUpdateShopInfoWh, handleUpdateShopStatusWh } from '@/services/webhook.service'
import { Context } from 'koa'

export const updateShopInfoWh = async (ctx: Context) => {
  const body = ctx.request.body as { email: string; domain: string }

  await handleUpdateShopInfoWh(body)
  ctx.status = 200
}

export const updateShopStatusWh = async (ctx: Context) => {
  const body = ctx.request.body as { domain: string }
  console.log('ShopStatus', body)

  await handleUpdateShopStatusWh(body)
}
