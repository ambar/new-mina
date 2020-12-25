# new-mina

使用 [mina 单文件组件](https://tina.js.org/#/guide/single-file-component)的微信小程序脚手架。

## 使用

创建一个新的小程序（确保安装了 [Node.js](https://nodejs.org)）：

```sh
npx new-mina myapp
cd myapp
npm start
```

打开[微信开发者工具](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html)，创建一个新项目，指向编译出来的 `dist` 目录。

## 附

你可以在项目根目录新建一个 `mina.config.js` 来修改 webpack 配置：

```js
module.exports = {
  webpack: {
    plugins: [],
  },
}
```
