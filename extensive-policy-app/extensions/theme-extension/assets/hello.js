const productTag = document.getElementById('product-tag')
const content = productTag.textContent
console.log("textContent", content)
const productTags = JSON.parse(content)
const params = new URLSearchParams();
productTags?.forEach((tag) => params.append("tag", tag));

const handleFetchApi = async () => {
    const res = await (await fetch(`https://untenuous-li-frothily.ngrok-free.dev/api/rules/tags?${params}`,
        { headers: { 'ngrok-skip-browser-warning': 'true', } }
    )).json()
    console.log('handleFetchApi', res);
}


handleFetchApi()

console.log("textContent", content, productTags)