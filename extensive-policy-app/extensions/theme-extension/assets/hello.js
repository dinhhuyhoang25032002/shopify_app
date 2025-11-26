// const data = window.BSS_B2B__PRODUCT_DATA__;

// const { productTags, rules, originalPrice: originalPriceRaw, currency, moneyFormat } = data;
// const discountSelect = document.getElementById('bss-b2b-discount-select');
// const priceElement = document.querySelector(".price-item.price-item--regular");
// const discountDiv = document.getElementById("bss-b2b-product-price-discount");

// if (!data) return;
// if (!discountSelect) return;
// if (!priceElement) return;
// if (!discountDiv) return;

// const filtered = rules.filter(item => {
//     if (item.apply === "ALL") return true;

//     if (item.apply === "TAGS") {
//         return Array.isArray(item.tag) && item.tag.some(t => productTag.includes(t));
//     }

//     return false;
// });

// discountSelect.innerHTML = "";

// if (filtered.length === 0) {
//     const option = document.createElement('option');
//     option.value = "";
//     option.textContent = "Không có discount";
//     discountSelect.appendChild(option);
// } else {
//     const defaultOption = document.createElement('option');
//     defaultOption.value = "";
//     defaultOption.textContent = "-- Chọn discount --";
//     discountSelect.appendChild(defaultOption);

//     filtered.forEach(rule => {
//         const option = document.createElement('option');
//         option.value = rule.name;
//         option.textContent = rule.name;
//         discountSelect.appendChild(option);
//     });
// }

// const originalPrice = parseFloat(
//     originalPriceRaw.replace(/[^0-9,.-]/g, "")  // bỏ ký tự không phải số
//         .replace(",", "")
// );

// const formatMoney = (amount) => {
//     const characters = moneyFormat.trim().match(/[^0-9,.\s]/)?.[1] || "$";
//     const formatted = `${characters}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${currency}`;
//     return formatted
// }
// const applyDiscount = (rule) => {
//     const discountDiv = document.getElementById("bss-b2b-product-price-discount");
//     let newPrice = originalPrice;

//     if (rule.type === "PERCENT") {
//         newPrice = originalPrice - (originalPrice * rule.value / 100);
//     }

//     if (rule.type === "SET_PRICE") {
//         newPrice = rule.value;
//     }

//     if (rule.type === "FIX_AMOUNT") {
//         newPrice = originalPrice - rule.value;
//     }

//     // Format tiền
//     const formatted = formatMoney(newPrice)
//     priceElement.textContent = formatted
//     discountDiv.innerHTML = `
//         <div style="color: red; font-weight: bold; margin-top: 6px;">
//             Discounted price: ${formatted}
//         </div>
//     `;
// };
// // On change => apply discount
// discountSelect.addEventListener("change", () => {
//     const selectedName = discountSelect.value;

//     if (!selectedName) {
//         document.getElementById("bss-b2b-product-price-discount").innerHTML = "";
//         return;
//     }

//     const rule = filtered.find(r => r.name === selectedName);
//     if (!rule) return;

//     applyDiscount(rule);
// });

(function () {

    // ---- Hàm chạy logic discount an toàn ----
    function runDiscountLogic() {
        const data = window.BSS_B2B__PRODUCT_DATA__;
        if (!data) return;

        const { productTags, rules, originalPrice: originalPriceRaw, currency, moneyFormat } = data;

        const discountSelect = document.getElementById('bss-b2b-discount-select');
        const priceElement = document.querySelector(".price-item.price-item--regular");
        const discountDiv = document.getElementById("bss-b2b-product-price-discount");

        // Nếu thiếu bất kỳ element nào → dừng
        if (!discountSelect || !priceElement || !discountDiv) return;

        // Filter rule
        const filtered = rules.filter(item => {
            if (item.apply === "ALL") return true;
            if (item.apply === "TAGS") {
                return Array.isArray(item.tag) && item.tag.some(t => productTags.includes(t));
            }
            return false;
        });

        // Render select options
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

        // Parse original price hiện tại từ DOM (phòng variant đã đổi)
        const priceText = priceElement.textContent?.trim() || originalPriceRaw || "";
        const originalPrice = parseFloat(priceText.replace(/[^0-9,.-]/g, "").replace(",", ""));
        if (isNaN(originalPrice)) return;

        const formatMoney = (amount) => {
            const symbol = moneyFormat.trim().match(/[^0-9,.\s]/)?.[1] || "$";
            return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${currency}`;
        };

        const applyDiscount = (rule) => {
            const priceEl = document.querySelector(".price-item.price-item--regular");
            const div = document.getElementById("bss-b2b-product-price-discount");

            if (!priceEl || !div) return;

            let newPrice = originalPrice;

            if (rule.type === "PERCENT") newPrice = originalPrice - (originalPrice * rule.value / 100);
            if (rule.type === "SET_PRICE") newPrice = rule.value;
            if (rule.type === "FIX_AMOUNT") newPrice = originalPrice - rule.value;

            const formatted = formatMoney(newPrice);

            priceEl.textContent = formatted;
            div.innerHTML = `
                <div style="color: red; font-weight: bold; margin-top: 6px;">
                    Discounted price: ${formatted}
                </div>
            `;
        };

        // Lắng nghe sự kiện change discount
        discountSelect.addEventListener("change", () => {
            const selectedName = discountSelect.value;
            if (!selectedName) {
                discountDiv.innerHTML = "";
                return;
            }

            const rule = filtered.find(r => r.name === selectedName);
            if (!rule) return;

            applyDiscount(rule);
        });
    }


    // ---- Gọi lần đầu khi trang load ----
    document.addEventListener("DOMContentLoaded", () => {
        runDiscountLogic();
    });


    // ---- Lắng nghe thay đổi variant (select, swatch, radio) ----
    const variantInputs = document.querySelectorAll('[name="options[]"], .product-form__input input');

    variantInputs.forEach(input => {
        input.addEventListener("change", () => {
            setTimeout(() => runDiscountLogic(), 10);
        });
    });


    // ---- Bắt thay đổi DOM giá (MutationObserver) ----
    const priceElement = document.querySelector(".price-item.price-item--regular");

    if (priceElement) {
        const observer = new MutationObserver(() => {
            runDiscountLogic();
        });

        observer.observe(priceElement, { childList: true, subtree: true });
    }

})();
