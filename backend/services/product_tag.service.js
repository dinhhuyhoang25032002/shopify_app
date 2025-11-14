import { handleFetchApi } from "../helper/handleFetchApi.js "

export const getProductTag = async (ctx) => {
    try {
        const query = {
            query: ` query {
          productTags(first: 100) {
            edges {
              node
            }
          }
        }`
        }
        const productTags = await handleFetchApi(ctx, query)
        const TagList = productTags.data.productTags.edges.map((item) => item.node)
        ctx.status = 200
        ctx.body = TagList
    } catch (error) {
        ctx.status = 500
        ctx.body = error
    }
}