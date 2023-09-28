const server = require('koa-static')
const Koa = require('koa');
const app = new Koa()

app.use(server('../dist'))

app.use(async ctx => {
  ctx.body = 'Hello World';
});
app.listen(3000)