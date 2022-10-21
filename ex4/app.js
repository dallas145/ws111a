import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const app = new Application()

const router = new Router()

router.post('/index', main)

app.use(router.routes())
app.use(router.allowMethods())

app.use(async (ctx, next) => {
    await next()
    console.log('path=', ctx.request.url.pathname)
    await send(ctx, ctx.request.url.pathname,{
        root: `${Deno.cwd()}/public/`,
        index: "index.html",
    })
})