const Koa = require('./koa-mini')
const app = new Koa()

app.use(async (ctx, next) => {
    console.log('Middleware 1 Start')
    await next()
    console.log('Middleware 1 End')
})

app.use(async (ctx, next) => {
    console.log('Middleware 2 Start')
    await next()
    console.log('Middleware 2 End')

    ctx.body = 'hello, world'
})

app.listen(3000)