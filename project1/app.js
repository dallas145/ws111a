import * as db from './db.js'
import {Server, sendJson, bodyParams, sendStatus, Status} from './server.js'

db.open()

const server = new Server()
server.public("/public")

server.router.get('/', home)
.get('/userList', userList)
.post('/login', login)
.post('/signup', signup)
.post('/forget1', forget)
.post('/msgAdd/:uto', msgAdd)
.post('/delete', deleteMsg)
.post('/logout', logout)
.post('/replyAdd/:mid', replyAdd)
.get('/msgGet/:id', msgGet)
.get('/msgBy/:user', msgBy)
.get('/msgS', msgS)
.get('/msglist', msgList)
.get('/msgKey/:key', msgKey)
.get('/usercheck/:user', usercheck)


async function home(ctx) {
    ctx.response.redirect("/public/#home")
}

async function userList(ctx) {
    let users = await db.userList()
    sendJson(ctx, users)
}

async function usercheck(ctx) {
  let user = await db.usercheck(ctx.params['user'])
  console.log(user)
  if (user) sendStatus(ctx, Status.OK)
  else sendStatus(ctx, Status.Fail)
}

async function deleteMsg(ctx) {
  const params = await bodyParams(ctx)
  console.log('params=', params)
  await db.deleteMsg(params.mid)
  sendStatus(ctx, Status.OK)
}

async function signup(ctx) {
  const params = await bodyParams(ctx)
  console.log('params=', params)
  let user = await db.userGet(params.user)
  if (user == null) { // user name available
    console.log('signup:params=', params)
    await db.userAdd({user:params.user, pass:params.password, email:params.email})
    sendStatus(ctx, Status.OK)
  }
  else
    sendStatus(ctx, Status.Fail)
}

async function login(ctx) {
  const params = await bodyParams(ctx)
  let user = await db.userGet(params.user)
  console.log('login:user=', user)
  if (user != null && user.pass == params.password) {
    await ctx.state.session.set('user', user)
    sendStatus(ctx, Status.OK)
  } else
    sendStatus(ctx, Status.Fail)
}

async function forget(ctx) {
  const params = await bodyParams(ctx)
  console.log(`user=${params.user0},email=${params.email0}`)
  let user = await db.userForget(params.user0)
  console.log(`user:${params.user0} forget password`)
  console.log(`useremail= ${user.email}`)
  console.log(`paramsemail= ${params.email0}`)
  if (user.email==params.email0) {
    sendJson(ctx, user)
  }
}

async function logout(ctx) {
  let user = await ctx.state.session.get('user')
  console.log('logout:user=', user)
  if (user != undefined) {
    await ctx.state.session.set('user', undefined)
    sendStatus(ctx, Status.OK)
  }
  else {
    sendStatus(ctx, Status.Fail)
  }
}

async function msgAdd(ctx) {
  let user = await ctx.state.session.get('user')
  if (user == null) {
    sendStatus(ctx, Status.Fail)
    return
  }
  let params = await bodyParams(ctx)
  let msg = {msg:params.msg, ufrom: user.user, comments:[]}
  console.log('msg=', msg)
  await db.msgAdd(msg)
  sendStatus(ctx, Status.OK)
}

async function msgList(ctx) {
  let msgs = await db.msgS()
  sendJson(ctx, msgs)
}

async function replyAdd(ctx) {
  let user = await ctx.state.session.get('user')
  if (user == null) {
    sendStatus(ctx, Status.Fail)
    return
  }
  let mid = ctx.params['mid']
  let params = await bodyParams(ctx)
  console.log('reply:params=', params)
  let reply = {mid:parseInt(mid), msg:params.msg, user:user.user}
  console.log('reply=', reply)
  await db.replyAdd(reply)
  sendStatus(ctx, Status.OK)
}

async function msgGet(ctx) {
  let msg = await db.msgGet(ctx.params['id'])
  sendJson(ctx, msg)
}

async function msgBy(ctx) {
    let msgs = await db.msgBy(ctx.params['user'])
    sendJson(ctx, msgs)
}

async function msgS(ctx) {
  let msgs = await db.msgS(ctx.params['user'])
  console.log(msgs)
  sendJson(ctx, msgs)
}

async function msgKey(ctx) {
  let msgs = await db.msgKey(ctx.params['key'])
  sendJson(ctx, msgs)
}

await server.listen(8001)
