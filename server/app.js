const Koa = require("koa");
const proxy = require("koa-server-http-proxy");
const app = new Koa();

// proxy
app.use(proxy('/api', {
  target: 'http://api.douban.com/',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/v2', // 重写路径
  },
}));
app.use(proxy('/bing', {
  target: 'https://www.bing.com/',
  changeOrigin: true,
  pathRewrite: {
    '^/bing': '/', // 重写路径
  },
}));

module.exports=app;
