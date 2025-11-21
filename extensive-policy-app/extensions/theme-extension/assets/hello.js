const productTag = JSON.parse(document.getElementById('product-tag')?.textContent);
const shopUrl = document.getElementById('shop-url')?.textContent;
const rulesData = JSON.parse(document.getElementById('rules-data')?.textContent);
const formatMoneyShop = document.getElementById('format-money-shop')?.textContent
const currency = JSON.parse(document.getElementById('currency-money-shop')?.textContent)
const priceElement = document.querySelector(
    ".price-item.price-item--regular"
);
console.log("priceElement", priceElement);

// Filter rule
const filtered = rulesData.filter(item => {
    if (item.apply === "ALL") return true;

    if (item.apply === "TAGS") {
        return Array.isArray(item.tag) && item.tag.some(t => productTag.includes(t));
    }

    return false;
});


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
        option.value = rule.name;
        option.textContent = rule.name;
        discountSelect.appendChild(option);
    });
}

const originalPrice = parseFloat(
    document.getElementById("product-price-original").textContent.replace(/[^0-9,.-]/g, "")  // bỏ ký tự không phải số
        .replace(",", "")
);
console.log("formatMoneyShop", formatMoneyShop, originalPrice, currency);
const formatMoney = (amount) => {
    const characters = formatMoneyShop.trim().match(/[^0-9,.\s]/)?.[1] || "$";
    const formatted = `${characters}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${currency}`;
    return formatted
}
const applyDiscount = (rule) => {
    const discountDiv = document.getElementById("product-price-discount");


    let newPrice = originalPrice;

    if (rule.type === "PERCENT") {
        newPrice = originalPrice - (originalPrice * rule.value / 100);
    }

    if (rule.type === "SET_PRICE") {
        newPrice = rule.value;
    }

    if (rule.type === "FIX_AMOUNT") {
        newPrice = originalPrice - rule.value;
    }

    // Format tiền
    const formatted = formatMoney(newPrice)
    priceElement.textContent = formatted
    discountDiv.innerHTML = `
        <div style="color: red; font-weight: bold; margin-top: 6px;">
            Discounted price: ${formatted}
        </div>
    `;
};
// On change => apply discount
discountSelect.addEventListener("change", () => {
    const selectedName = discountSelect.value;

    if (!selectedName) {
        document.getElementById("product-price-discount").innerHTML = "";
        return;
    }

    const rule = filtered.find(r => r.name === selectedName);
    if (!rule) return;

    applyDiscount(rule);
});


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
    )).json();
    console.log('handleFetchApi', res);
};

handleFetchApi();
