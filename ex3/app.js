import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB('data.db');
db.query("CREATE TABLE IF NOT EXISTS posts ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT)");

const router = new Router();

router.get('/', list)
    .get('/post/new', add)
    .get('/post/:id', show)
    .post('/post', create);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

function query(sql){
    let list = [];
    
}

async function list(ctx){
    ctx.response.body = await render.list(posts);
}

async function add(ctx){
    ctx.response.body = await render.newpost();
}

async function show(ctx){
    const id = ctx.params.id;
    let posts = query(`SELECT id, title, body FROM posts WHERE id=${id}`);
    let post = posts[0];
    if(!post) ctx.throw(404, "Invalid post id.");
    ctx.response.body = await render.show(post);
}

async function create(ctx){
    const body = ctx.request.body();
    if(body.type==="form"){
        const pairs = await body.value;
        const post = {};
        for(const[key, value] of pairs){
            post[key]=value;
        }
        console.log('create:post=', post);
        db.query("INSERT INTO posts ( title, body ) VALUES ( ?, ? )", [post.title, post.body]);
        ctx.response.redirect('/');
    }
}

console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port:8000 });