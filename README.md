# fuck-bushiroad-store-cart

这是一个 Tampermonkey 油猴脚本，用于在 Bushiroad Store 的商品列表页中，当正常的预约按钮不存在或被禁用时，插入 **强制加入购物车** 按钮。

## 功能

- 在愿望单按钮前插入「予約注文（强制）」按钮。
- 仅在以下情况出现：
  - 页面没有任何「予約注文」按钮；或
  - 所有「予約注文」按钮均为禁用状态。
- 监听 DOM 变化，支持懒加载与 SPA 页面。

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/)（或其他用户脚本管理器）。
2. 新建脚本并将内容替换为 [`fuck-bushiroad-store-cart.user.js`](./fuck-bushiroad-store-cart.user.js)。
3. 保存后访问匹配页面：
   - `https://bushiroad-store.com/collections/*`

## 开发

仓库中的脚本文件可直接复制粘贴到 Tampermonkey 使用。

## 许可证

本项目采用 [MIT License](./LICENSE)。
