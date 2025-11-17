import { handleGetProducts } from 'src/services/product.service'
import { Context } from 'koa'

export const getProducts = async (ctx: Context) => {
  try {
    const user = ctx.state.user
    const tags = ctx.query.tag
    const last = ctx.query.last
    console.log('last', last)

    const products = await handleGetProducts(user, tags, last)

    ctx.status = 200
    ctx.body = products
  } catch (error) {
    console.error(error)
    ctx.status = 500
    ctx.body = 'Error fetching products'
  }
}
