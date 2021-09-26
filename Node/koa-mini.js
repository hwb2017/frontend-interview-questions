// 参考 https://github.com/shfshanyue/mini-code

const http = require('http')

const compose = (middlewares) => {
    return ctx => {
        const dispatch = (i) => {
            const middleware = middlewares[i]
            if (i === middlewares.length) {
                return
            }
            return middleware(ctx, () => dispatch(i+1))
        }
        return dispatch(0)
    }
}

class Application {
    constructor() {
        this.middlewares = []
    }
    listen(...args) {
        const server = http.createServer(async (req, res) => {
            const ctx = new Context(req, res)
            try {
                const fn = compose(this.middlewares)
                await fn(ctx)
            } catch(e) {
                console.error(e)
                ctx.res.statusCode = 500
                ctx.res.write('Internal Server Error')
            }
            ctx.res.end(ctx.body)
        })
        server.listen(...args)
    }
    use(middleware) {
        this.middlewares.push(middleware)
    }
}

class Context {
    constructor(req, res) {
        this.req = req
        this.res = res
    }
}

module.exports = Application