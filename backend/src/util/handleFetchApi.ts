export const handleFetchApi = async (user, query: { query: string }) => {
  try {
    const { shop, url } = user;
    const data = await (
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shop.token,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(query),
      })
    ).json();
    return data;
  } catch (error) {
    throw error;
  }
};
