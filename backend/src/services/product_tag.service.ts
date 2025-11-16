import { handleFetchApi } from '@/util/handleFetchApi';

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
    `,
  };

  const response = await handleFetchApi(user, query);

  return response.data.productTags.edges.map((item: any) => item.node);
};
