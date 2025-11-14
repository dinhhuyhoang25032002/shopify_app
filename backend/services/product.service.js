import { handleFetchApi } from "../helper/handleFetchApi.js";

export const GetProducts = async (ctx) => {
    const shop = ctx.state.user.shop
    const tags = ctx.query.tag
    console.log(tags);

    let query;

    if (tags) {
        let tagFilter;
        if (typeof tags === "string") {
            tagFilter = `tag:${tags}`;
        } else if (Array.isArray(tags)) {
            tagFilter = tags.map(t => `tag:${t}`).join(" AND ");
        }

        query = {
            query: `
        query ($filter: String!) {
          products(first: 20, query: $filter) {
            edges {
              node {
                id
                title
                tags
                variants(first: 1) {
                  edges { node { price } }
                }
                media(first: 1) {
                    edges {
                        node {
                        preview {
                            image {
                            url
                            }
                        }
                        }
                    }
                }
              }
            }
          }
        }
      `,
            variables: { filter: tagFilter }
        }
    } else {
        query = {
            query: `
    query GetProducts {
      products(first: 10) {
        edges {
          node {
            id
            title
            media(first: 5) {
              edges {
                node {
                  preview {
                    image {
                      url
                    }
                  }
                }
              }
            }
           variants(first: 1) {
                edges { node { price } }
            }
          }
        }
      }
    }`
        }
    }
    if (!shop) {
        ctx.status = 404
        ctx.body = "Shop not found."
        return
    }
    try {

        const product = await handleFetchApi(ctx, query)

        const products = product.data.products.edges.map(({ node }) => ({
            id: node.id,
            title: node.title,
            image: node.media?.edges?.[0]?.node?.preview?.image?.url ?? null,
            price: node.variants?.edges?.[0]?.node?.price ?? null,
        }));

        ctx.status = 200
        ctx.body = products;
    } catch (error) {
        ctx.status = 500
        ctx.body = error
    }
}