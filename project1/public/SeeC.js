window.onhashchange = async function () {
    var tokens = window.location.hash.split('/')
    var user
    switch (tokens[0]) {
      case '#home':
        Ui.goto('#msgs')
        break
      case '#userList':
        await userList()
        break
      case '#signup':
        await signup()
        break
      case '#login':
        await login()
        break
      case '#new':
        await Newpost()
        break
      case '#logout':
        await logout()
        break
      case '#Yours':
        user = localStorage.getItem('user')
        Ui.goto(`#msgBy/${user}`)
        break
      case '#msgGet':
        let mid = uriDecode(tokens[1])
        await msgGet(mid)
        break
      case '#msgBy':
        user = uriDecode(tokens[1])
        await msgList('By', user)
        break
      case '#msgs':
        await allmsg()
        break
      case '#msgKey':
        key = uriDecode(tokens[1])
        await msgKey(key)
        break
      default:
        console.log(`Error:hash=${tokens[0]}`)
        // Ui.goto('#home')
        break
    }
}

window.onload = function () {
  window.onhashchange()
}

function usersHtml(users) {
  let outs = []
  for (let user of users) {
    outs.push(`<li><a href="#msgBy/${user}">${user}</a></li>`)
  }
  return outs.join('\n')
}

async function userList() {
  let r = await Server.get(`/userList`)
  let users = r.obj
  console.log('users=', users)
  Ui.show(`<div class="block">
  <h1>Users</h1>\n<ul>\n${usersHtml(users)}\n</ul>\n
  </div>`)
}

async function userCheck() {

}

async function signup() {
    Ui.show(`
    <div class="login">
    <form>
            <h1>Sign Up</h1>
            <tr>
                <td><p><input type="text" name="Username" placeholder="Your Username" id="user"></p></td>
            </tr>
            <tr>
                <td><p><input type="text" name="email" placeholder="Your Email" id="email"></p></td>
            </tr>
            <tr>
                <td><p><input type="password" name="password" placeholder="Your Password" id="password"></p></td>
            </tr>
            <button type="button" class="success" onclick="serverSignup()">Submit</button>
            </form>
        </div>`)
  }

async function login() {
    Ui.show(`
    <div class="login">
                <form>
                <h1>Log In</h1>
                <tr>
                    <td><p><input type="text" name="Username" placeholder="Your Username" id="user"></p></td>
                </tr>
                <tr>
                    <td><p><input type="password" name="password" placeholder="Your Password" id="password"></p></td>
                </tr>
                <tr>
                    <td><p><a href="#signup">Don't have an account?</a></p></td>
                </tr>
                <tr>
                    <button type="button" class="success" id="submit" onclick="serverLogin()">Log In</button>
                </tr>
            </form>
            </div>`)
}

async function serverSignup() {
    let user = Ui.id('user').value
    let password = Ui.id('password').value
    let email = Ui.id('email').value
    let r = await Server.post('/signup', {user, password, email})
    console.log('serverLogin: r=', r)
    if (r.status == Status.OK) {
      alert('註冊成功，開始登入使用!')
      Ui.goto('#login')
    } else {
      alert('註冊失敗，請選擇另一個使用者名稱!')
    }
}

async function serverLogin() {
    let user = Ui.id('user').value
    let password = Ui.id('password').value
    let r = await Server.post('/login', {user, password})
    console.log('serverLogin: r=', r)
    if (r.status == Status.OK) {
      localStorage.setItem('user', user)
      Ui.goto(`#home`)
    } else
      alert('登入失敗: 請輸入正確的帳號密碼!')
}

async function logout() {
  user = localStorage.getItem('user')
  if (user=='undefined'){
    alert('你根本沒登入')
    Ui.goto('#login')
  }
  else {
    let yes = confirm('確定要登出？')
    if (yes) serverlogout()
  }
}

async function serverlogout() {
  let r = await Server.post('/logout')
  console.log('logout:r=:', r)
  console.log('r.status=', r.status)
  if (r.status == Status.OK) {
    Ui.goto('#login')
    localStorage.setItem('user', undefined)
  }
  else {
    alert('你根本沒登入!')
    Ui.goto('#login')
  }
}

async function Newpost() {
  user = localStorage.getItem('user')
  if (user=='undefined'){
    alert('Login to continue.')
    Ui.goto('#login')
  }
  else {
    Ui.show(`
    <div class="block">
    <textarea class="typein" id="say" placeholder="${user} put something here!" maxlength=50></textarea>
        <span class="wordsNum">0/50</span>
        <button class="secondary" onclick="serverSayit(Ui.id('say').value)">說了</button></h2>
    </div>`)
  }
}

function msgToHtml(msg) {
  return `
    <div class="title" onclick="Ui.goto('#msgGet/${msg.mid}')">
      <p>
        <em class="user"><a href="#msgBy/${msg.ufrom}">${msg.ufrom}</a></em> : 
        ${msgFormat(msg.msg)} 
        <em class="time">${timeFormat(msg.time)}</em>
      </p>
    </div>
    `
}

async function serverSayit(msg) {
  let user = localStorage.getItem('user')
  let r = await Server.post(`/msgAdd/${user}`, {msg})
  console.log(`sayit: user=${user} r=`, r)
  if (r.status == Status.OK) {
    Ui.goto(`#`)
    Ui.goto(`#msgBy/${user}`)
  } else
    alert('貼文失敗!')
}

async function serverReplyAdd(mid) {
  // let user = localStorage.getItem('user')
  let msg = Ui.id('reply').value
  console.log('reply:msg=', msg)
  let r = await Server.post(`/replyAdd/${mid}`, {mid, msg})
  if (r.status == Status.OK) {
    Ui.goto(`#`)
    Ui.goto(`#msgGet/${mid}`)
  } else
    alert('貼文失敗!')
}

function timeFormat(time) {
  let minutes = Math.round((Date.now()-time)/(1000*60))
  // console.log('minutes=', minutes)
  if (minutes<60)
    return `${minutes} minutes ago`
  else if (minutes < 60*24)
    return `${Math.round(minutes/60)} hours ago`
  else {
    let date = new Date(time)
    return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
  }
}

function msgFormat(msg) {
  var linkExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  var html = msg.replace(linkExp,"<a href='$1'>$1</a>")
  html = html.replace(/@(\w+)/ig, "<a href='#msgBy/$1'>$1</a>")
  html = html.replace(/\n/ig, '<br/>')
  return html
}

function autosize(self) {
  self.style.height = 0;
  self.style.height = (self.scrollHeight) + "px";
  len = self.value.length
  console.log(len)
  
}

function replysToHtml(replys) {
  var list = []
  for (let reply of replys) {
    list.push(`
    <div>
      <p><em class="user"><a href="#msgBy/${reply.user}">${reply.user}</a></em> : 
      ${reply.msg}</p>
      <p><em class="time">${timeFormat(msg.time)}</em></p>
    </div>`)
  }
  return list.join('\n')
}

function msgToHtml(msg) {
  return `
    <div class="title" onclick="Ui.goto('#msgGet/${msg.mid}')">
      <p>
        <em class="user"><a href="#msgBy/${msg.ufrom}">${msg.ufrom}</a></em> : 
        ${msgFormat(msg.msg)} 
        <em class="time">${timeFormat(msg.time)}</em>
      </p>
    </div>
    `
}

async function msgGet(id) {
  let r = await Server.get(`/msgGet/${id}`)
  msg = r.obj
  Ui.show(`
    ${msgToHtml(msg)}\n
    <div>
      <textarea id="reply"></textarea>
      <button class="op" onclick="serverReplyAdd(${msg.mid})">回應本文</botton>
    </div>
    ${replysToHtml(msg.replys)}`
  )
}

function search() {
  Ui.goto(`#msgKey/${Ui.id('queryBox').value}`)
}

async function msgKey(key) {
  let r = await Server.get(`/msgKey/${key}`)
  let msgs = r.obj
  let outs = []
  for (let msg of msgs) {
    outs.push(msgToHtml(msg))
  }
  Ui.show(`
  <div class="searchBox">
    <input id="queryBox" type="text" value="${key}"/>
    <button onclick="search()">查查</button>
  </div>\n
  <h1>查詢結果</h1>
  <ul>${outs.join('\n')}</ul>`)
}

async function allmsg() {
  let r = await Server.get('/msglist')
  let msgs = r.obj
  let outs = []
  let user = localStorage.getItem('user')
  for (let msg of msgs) {
    outs.push(msgToHtml(msg))
  }
  if(user=='undefined'){
    alert('Login to continue.')
    Ui.goto('#login')
  }
  else{
    Ui.show(`
    <div class="block">
      <h2>Posts:</h2>
      ${outs.join('\n')}\n
    </div>
    
    `
    )
  }
}

async function msgList(op, user) {
  let r = await Server.get(`/msg${op}/${user}`)
  let msgs = r.obj
  let outs = []
  let luser = localStorage.getItem('user')
  for (let msg of msgs) {
    outs.push(msgToHtml(msg))
  }
  if(luser=='undefined'){
    alert('Login to continue.')
    Ui.goto('#login')
  }
  else{
    Ui.show(`
    <div class="block">
      <h2>${user}'s Posts:</h2>
      ${outs.join('\n')}\n
    </div>
    
    `
    )
  }
}

function uriDecode(line) {
  return (line == null)?null:decodeURIComponent(line)
}

//

const Server = {}

Server.get = async function(path) {
  let r = await window.fetch(path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return {status:r.status, obj:await r.json()}
}

Server.post = async function(path, params) {
    let r = await window.fetch(path, {
      body: JSON.stringify(params),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return {status:r.status, obj:await r.json()}
  }

const Status = {
    OK:200,
    Fail:400,
    Unauthorized:401,
    Forbidden:403,
    NotFound:404,
  }
  
//

const Ui = {}

Ui.id = function(path) {
    return document.getElementById(path)
}

Ui.show = function (html) {
    Ui.id('content').innerHTML = html
}

Ui.goto = function (hash) {
    window.location.hash = hash
}