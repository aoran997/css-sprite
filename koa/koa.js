const server = require('koa-static')
const Koa = require('koa');
const path = require('path')
const app = new Koa()

app.use(server(path.join(__dirname, 'dist')))

app.listen(3000)

console.log('server start:3000')