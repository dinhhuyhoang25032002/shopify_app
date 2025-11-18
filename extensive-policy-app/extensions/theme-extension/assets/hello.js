const productTag = document.getElementById('product-tag')?.textContent
const shopUrl = document.getElementById('shop-url')?.textContent
const productMetafield = document.getElementById('product-metafield')?.textContent
console.log("productMetafield", productMetafield);

const handleFetchApi = async () => {
    const res = await (await fetch(`https://untenuous-li-frothily.ngrok-free.dev/api/rules/metafield`,
        {
            headers: {
                'ngrok-skip-browser-warning': 'true',
                "Content-Type": "application/json",
            },

            method: "POST",
            body: JSON.stringify({ url: JSON.parse(shopUrl) })
        }
    )).json()
    console.log('handleFetchApi', res);
}


//handleFetchApi()
