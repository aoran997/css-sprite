const server = require('koa-static')
// const sqlite3 = require('sqlite3').verbose()
const Koa = require('koa')
const app = new Koa()
// const db = new sqlite3.Database('db.db')
let needWrite = ['/', '/index.html']

// db.serialize(() => {
  // db.run(`CREATE TABLE if not exists log ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  // "ip" TEXT,
  // "time" DATE)`);

  app.use(async (ctx, next) => {
    if (needWrite.includes(ctx.URL.pathname)) {
      var ip = ctx.headers['X-Forwarded-For'] || ctx.header.forwarded || ctx.ip
      if (ip.startsWith('::ffff:')) {
        ip = ip.substring(7)
      }
      // db.exec(`insert into log (ip, time) values ('${ip}', '${new Date().getTime()}')`)
      console.log(ctx.URL.href, ip, new Date().toLocaleString())
    }
    await next();
  });
  
  app.use(server('./dist', {
    gzip: true,
    maxage: 60 * 1000 * 60 * 5
  }))
  
  
  app.listen(3000)
  
  console.log('server start:3000')
// })