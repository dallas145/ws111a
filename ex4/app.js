import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("Mydb.db")
const app = new Application()
const router = new Router()

router.get('/', mainpage)
.get('/sqlcmd/:cmd', sqlcmd)
.get('/public/(.*)', pub)

app.use(router.routes())
app.use(router.allowedMethods())

async function mainpage(ctx){
    ctx.response.redirect('/public/')
}

async function pub(ctx){
    console.log(ctx.request.url.pathname)
    await send(ctx, ctx.request.url.pathname,{
        root:`${Deno.cwd()}/`,
        index:"index.html",
    })
}

async function sqlcmd(ctx){
    let command = ctx.params['cmd']
    console.log(command)
    let result = db.query(command)
    console.log(result)
    ctx.response.type='application/json'
    ctx.response.body = result
}

console.log('Server run at http://127.0.0.1:8000')
await app.listen({ port: 8000 })