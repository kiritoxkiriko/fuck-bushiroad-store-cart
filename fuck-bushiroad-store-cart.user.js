// ==UserScript==
// @name         fuck-bushiroad-store-cart
// @namespace    https://tampermonkey.net/
// @version      1.4
// @description  bushiroad-store 增加强制加入购物车按钮
// @author       kiritoxkiriko
// @match        https://bushiroad-store.com/collections/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_HTML = `
        <button type="submit"
                class="product-form__add-button button button--primary"
                data-action="add-to-cart">
            予約注文（强制）
        </button>
        <div style="height: 8px;"></div>
    `;

    function shouldInsert(container) {
        const reserveButtons = Array.from(container.querySelectorAll('button'))
            .filter(btn => (btn.textContent || '').includes('予約注文'));

        // 情况 1：完全没有「予約注文」按钮
        if (reserveButtons.length === 0) {
            return true;
        }

        // 情况 2：有预约按钮，但全部是 disabled
        const hasEnabledReserveButton = reserveButtons.some(
            btn => !btn.classList.contains('button--disabled')
        );

        return !hasEnabledReserveButton;
    }

    function insertButton() {
        const wishlistButtons = document.querySelectorAll('button.add-to-wishlist');

        wishlistButtons.forEach(wishlistBtn => {
            const container = wishlistBtn.parentElement;
            if (!container) return;

            // 防止重复插入强制按钮
            const alreadyInserted = Array.from(container.querySelectorAll('button'))
                .some(btn => btn.textContent.includes('予約注文（强制）'));
            if (alreadyInserted) return;

            if (!shouldInsert(container)) return;

            // 在 wishlist 按钮前插入
            wishlistBtn.insertAdjacentHTML('beforebegin', BUTTON_HTML);
        });
    }

    // 初次执行
    insertButton();

    // 监听 DOM 变化（懒加载 / SPA）
    const observer = new MutationObserver(() => {
        insertButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
