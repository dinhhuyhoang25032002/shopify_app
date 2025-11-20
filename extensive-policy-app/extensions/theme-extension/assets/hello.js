const productTag = JSON.parse(document.getElementById('product-tag')?.textContent ?? "")
const shopUrl = document.getElementById('shop-url')?.textContent
const rulesData = JSON.parse(document.getElementById('rules-data')?.textContent ?? "")

const filtered = array2.filter(item =>
    Array.isArray(item.tag) && item.tag.some(t => array1.includes(t))
);
console.log("filtered", filtered);
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

handleFetchApi()
