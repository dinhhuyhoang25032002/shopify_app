import { handleGetProducts } from 'src/services/product.service'
import { Context } from 'koa'
import { handleGetProductTag } from '@/services/product.service'

export const getProducts = async (ctx: Context) => {
  try {
    const user = ctx.state.user
    const tags = ctx.query.tag
    const last = ctx.query.last


    const products = await handleGetProducts(user, tags, last)

    ctx.status = 200
    ctx.body = products
  } catch (error) {
    console.error(error)
    ctx.status = 500
    ctx.body = 'Error fetching products'
  }
}

export const getProductTag = async (ctx: Context) => {
  try {
    const user = ctx.state.user // giả sử user được lưu trong state từ auth middleware

    const tags = await handleGetProductTag(user)

    //ctx.status = 200
    ctx.body = tags
  } catch (error) {
    console.error(error)
    ctx.status = 500
    ctx.body = 'Error fetching product tags'
  }
}
