const productTag = JSON.parse(document.getElementById('product-tag')?.textContent ?? "")
const shopUrl = document.getElementById('shop-url')?.textContent
const rulesData = JSON.parse(document.getElementById('rules-data')?.textContent ?? "")

const filtered = rulesData.filter(item =>
    Array.isArray(item.tag) && item.tag.some(t => productTag.includes(t))
);
const discountSelect = document.getElementById('discount-select');
discountSelect.innerHTML = "";
if (filtered.length === 0) {
    const option = document.createElement('option');
    option.value = "";
    option.textContent = "Không có discount";
    discountSelect.appendChild(option);
} else {
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "-- Chọn discount --";
    discountSelect.appendChild(defaultOption);
    filtered.forEach(rule => {
        const option = document.createElement('option');
        option.value = rule.name; // hoặc rule.id nếu có
        option.textContent = rule.name;
        discountSelect.appendChild(option);
    });
}
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
