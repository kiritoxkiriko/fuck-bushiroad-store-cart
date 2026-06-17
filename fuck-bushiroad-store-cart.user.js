// ==UserScript==
// @name         bushiroad-store-force-cart-button
// @namespace    https://tampermonkey.net/
// @version      1.7
// @description  bushiroad-store 在 product-form__info-list 后强制插入加入购物车按钮
// @author       kiritoxkiriko
// @match        https://bushiroad-store.com/collections/*
// @match        https://bushiroad-store.com/collections/*/products/*
// @match        https://bushiroad-store.com/products/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const FORCE_BUTTON_CLASS = 'force-reserve-cart-button';
    const FORCE_BUTTON_TEXT = '予約注文（强制）';

    function createButton() {
        const wrapper = document.createElement('div');
        wrapper.className = 'force-reserve-cart-button-wrapper';
        wrapper.style.marginTop = '12px';
        wrapper.style.marginBottom = '12px';

        wrapper.innerHTML = `
            <button type="submit"
                    class="${FORCE_BUTTON_CLASS} product-form__add-button button button--primary"
                    data-action="add-to-cart"
                    style="width: 100%;">
                ${FORCE_BUTTON_TEXT}
            </button>
        `;

        return wrapper;
    }

    function findProductForm(anchor) {
        return (
            anchor.closest('form') ||
            document.querySelector('form[action*="/cart/add"]') ||
            document.querySelector('form.product-form') ||
            document.querySelector('form')
        );
    }

    function bindButton(button, anchor) {
        button.addEventListener('click', function (e) {
            const form = findProductForm(anchor);

            // 如果按钮本身已经在 form 里面，直接让 submit 生效
            if (form && form.contains(button)) {
                return;
            }

            // 如果按钮不在 form 里面，手动提交最近的购物车表单
            if (form) {
                e.preventDefault();

                const realSubmitButton = form.querySelector(
                    'button[type="submit"], button[data-action="add-to-cart"], input[type="submit"]'
                );

                if (realSubmitButton) {
                    realSubmitButton.disabled = false;
                    realSubmitButton.classList.remove('button--disabled');
                    realSubmitButton.removeAttribute('disabled');
                    realSubmitButton.removeAttribute('aria-disabled');
                }

                if (typeof form.requestSubmit === 'function') {
                    form.requestSubmit();
                } else {
                    form.submit();
                }

                return;
            }

            console.warn('[force-cart] 找不到购物车 form，无法提交');
        });
    }

    function insertAfterInfoList() {
        const infoLists = document.querySelectorAll('.product-form__info-list');

        infoLists.forEach(infoList => {
            const alreadyInserted =
                infoList.nextElementSibling &&
                infoList.nextElementSibling.classList &&
                infoList.nextElementSibling.classList.contains('force-reserve-cart-button-wrapper');

            if (alreadyInserted) return;

            const wrapper = createButton();

            // 强制插到 div.product-form__info-list 后面
            infoList.insertAdjacentElement('afterend', wrapper);

            const button = wrapper.querySelector(`.${FORCE_BUTTON_CLASS}`);
            bindButton(button, infoList);

            console.log('[force-cart] 已插入强制按钮到 product-form__info-list 后面');
        });
    }

    function run() {
        insertAfterInfoList();
    }

    run();

    const observer = new MutationObserver(() => {
        run();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
