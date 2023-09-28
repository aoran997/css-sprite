const server = require('koa-static')
const Koa = require('koa');
const app = new Koa()

app.use(server('./dist'))

app.listen(3000)

console.log('server start:3000')