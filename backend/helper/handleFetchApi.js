export const handleFetchApi = async (ctx, query) => {
    const version = "2025-07"
    try {
        const iss = ctx.state.user.iss
        const token = ctx.state.user.shop.token
        const url = `${iss}/api/${version}/graphql.json`
        const data = await (await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": token,
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify(query)
        })).json()
        return data;
    } catch (error) {
        throw error
    }

}