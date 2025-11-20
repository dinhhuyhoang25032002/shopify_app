import { Context, Next } from 'koa'
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

declare module 'koa' {
  interface Request {
    rawBody?: string
  }
}

export async function shopifyWebhookVerifier(ctx: Context, next: Next) {
  // Chỉ áp dụng cho route webhook
  if (ctx.method === 'POST' && ctx.path.startsWith('/api/webhooks')) {
    const rawBody = ctx.request.rawBody

    const hmac = ctx.headers['x-shopify-hmac-sha256'] as string
    if (!hmac || !rawBody) {
      ctx.status = 400
      ctx.body = 'Missing HMAC header or Body'
      return
    }

    const secret = process.env.SHOPIFY_API_SECRET!
    const hash = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64')

    if (!crypto.timingSafeEqual(Buffer.from(hash, 'base64'), Buffer.from(hmac, 'base64'))) {
      ctx.status = 401
      ctx.body = 'Invalid HMAC'
      return
    }
  }

  await next()
}
