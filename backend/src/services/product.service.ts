import { handleFetchApi } from '@/util/handleFetchApi.js';
interface ProductResult {
  id: string;
  title: string;
  image: string | null;
  price: string | null;
}
export const handleGetProducts = async (
  user,
  tags: string | string[] | undefined,
  limit = 20,
): Promise<ProductResult[]> => {
  let query;

  if (tags) {
    let tagFilter: string;
    if (typeof tags === 'string') {
      tagFilter = `tag:${tags}`;
    } else {
      tagFilter = tags.map(t => `tag:${t}`).join(' AND ');
    }

    query = {
      query: `
        query ($filter: String!) {
          products(first: ${limit}, query: $filter) {
            edges {
              node {
                id
                title
                tags
                variants(first: 1) { edges { node { price } } }
                media(first: 1) {
                  edges { node { preview { image { url } } } }
                }
              }
            }
          }
        }
      `,
      variables: { filter: tagFilter },
    };
  } else {
    query = {
      query: `
        query {
          products(first: ${limit}) {
            edges {
              node {
                id
                title
                media(first: 5) {
                  edges { node { preview { image { url } } } }
                }
                variants(first: 1) { edges { node { price } } }
              }
            }
          }
        }
      `,
    };
  }

  const response = await handleFetchApi(user, query);

  return response.data.products.edges.map(({ node }: any) => ({
    id: node.id,
    title: node.title,
    image: node.media?.edges?.[0]?.node?.preview?.image?.url ?? null,
    price: node.variants?.edges?.[0]?.node?.price ?? null,
  }));
};
