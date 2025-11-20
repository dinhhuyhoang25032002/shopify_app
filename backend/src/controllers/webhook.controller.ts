import { handleUpdateShopInfoWh, handleUpdateShopStatusWh } from '@/services/webhook.service'
import { Context } from 'koa'

export const updateShopInfoWh = async (ctx: Context) => {
  const body = ctx.request.body as { email: string; domain: string }
  ctx.status = 200
  await handleUpdateShopInfoWh(body)
}

export const updateShopStatusWh = async (ctx: Context) => {
  const body = ctx.request.body as { domain: string }
  await handleUpdateShopStatusWh(body)
}
