import { handleFetchApi } from 'src/util/handleFetchApi.js'
interface ProductResult {
  id: string
  title: string
  image: string | null
  price: string | null
}

export const handleGetProducts = async (
  user: any,
  tags: string | string[] | undefined,
  last: string | string[] | undefined,
  limit = 10
): Promise<{
  items: ProductResult[]
  pageInfo: { hasNextPage: boolean; endCursor: string | null }
}> => {
  let variables: any = { limit }

  if (tags) {
    const filter = typeof tags === 'string' ? `tag:${tags}` : tags.map((t) => `tag:${t}`).join(' AND ')
    variables.filter = filter
  }

  if (last) {
    variables.after = last
  }

  const query = {
    query: `
      query ($limit: Int!, $filter: String, $after: String) {
        products(first: $limit, query: $filter, after: $after) {
          edges {
            cursor
            node {
              id
              title
              tags
              variants(first: 1) { edges { node { price } } }
              media(first: 1) { edges { node { preview { image { url } } } } }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
    variables
  }

  const response = await handleFetchApi(user, query)

  const edges = response.data.products.edges
  const pageInfo = response.data.products.pageInfo

  const items = edges.map(({ node, cursor }: any) => ({
    id: node.id,
    title: node.title,
    image: node.media?.edges?.[0]?.node?.preview?.image?.url ?? null,
    price: node.variants?.edges?.[0]?.node?.price ?? null,
    cursor
  }))

  return {
    items,
    pageInfo
  }
}

export const handleGetProductTag = async (user: any): Promise<string[]> => {
  const query = {
    query: `
      query {
        productTags(first: 100) {
          edges {
            node
          }
        }
      }
    `
  }

  const response = await handleFetchApi(user, query)

  return response.data.productTags.edges.map((item: any) => item.node)
}
