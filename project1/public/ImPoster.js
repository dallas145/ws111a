window.onhashchange = async function () {
    var tokens = window.location.hash.split('/')
    var user
    switch (tokens[0]) {
      case '#home':
        localStorage.setItem('admin', undefined)
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
      case '#forget':
        await forget()
        break
      case '#sudo':
        await adminPanel()
        break
      case '#admin':
        await RealAdminPanel()
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
  console.log(localStorage.getItem('user'))
}

async function adminPanel() {
  Ui.show(`
  <div class="login">
    <form>
      <h1>Admin Log In</h1>
      <tr>
          <td><p><input type="text" name="Username" placeholder="Admin Username" id="user"></p></td>
      </tr>
      <tr>
          <td><p><input type="password" name="password" placeholder="Admin Password" id="password"></p></td>
      </tr>
      <tr>
          <button type="button" class="dark" id="submit" onclick="gotoAdminPanel()">Log In</button>
      </tr>
    </form>
  </div>
  `)
}

async function gotoAdminPanel() {
  let aname = Ui.id('user').value
  let apass = Ui.id('password').value
  if (aname == 'admin' && apass == 'admin') {
    localStorage.setItem('admin', 'admin')
    alert('Admin mode ON')
    Ui.goto('#admin')
  }
  else alert('Wrong super username and super password.')
}

async function RealAdminPanel() {
  let admin = localStorage.getItem('admin')
  if (admin!='undefined') {
    let r = await Server.get('/msglist')
    let msgs = r.obj
    let outs = []
    let user = localStorage.getItem('user')
    let mid
    for (let msg of msgs) {
      mid = msg.mid
      outs.push(msgToHtmlForAdmin(msg))
    }
    if(user=='undefined'||user==null){
      alert('Login to continue.')
      Ui.goto('#login')
    }
    else{
      Ui.show(`
      <div class="block">
        <button class="warning" onclick="exitadmin()">Exit admin mode</button>
        <h2>All Posts:</h2>
        ${outs.join('\n<hr>')}\n
      </div>
      
      `)}
  }
  else {
    alert('Login to continue')
    Ui.goto('#sudo')
  }
}

async function exitadmin() {
  let yes = confirm('Are you sure about that?')
  if (yes) {
    localStorage.setItem('admin', undefined)
    Ui.goto('#home')
  }
}

async function serverDelete(mid) {
  console.log("i=",mid)
  let yes = confirm(`You sure you want to delete\npost id: ${mid} ?`)
  if (yes) {
    let r = await Server.post('/delete', {mid})
    if (r.status == Status.OK) {
      alert('Delete successfully')
      await RealAdminPanel()
    }
  }
}

function usersHtml(users) {
  let outs = []
  for (let user of users) {
    outs.push(`<p><a href="#msgBy/${user}">${user}</a></p>`)
  }
  return outs.join('\n')
}

async function userList() {
  let r = await Server.get(`/userList`)
  let users = r.obj
  console.log('users=', users)
  Ui.show(`<div class="block">
  <h1>Users</h1>\n${usersHtml(users)}\n\n
  </div>`)
}

async function forget() {
  Ui.show(`
  <div class="login">
    <form>
    <h1>Forget password</h1>
    <p>Answer the question below to get your password.</p>
    <tr>
      <td><p><input type="text" placeholder="Your Username" id="usera"></p></td>
    </tr>
    <tr>
      <td><p><input type="text" placeholder="Repeat Your Username" id="userb"></p></td>
    </tr>
    <tr>
      <td><p><input type="text" placeholder="Your E-mail" id="emaila"></p></td>
    </tr>
    <tr>
      <td><p><input type="text" placeholder="Repeat Your E-mail" id="emailb"></p></td>
    </tr>
    <button type="button" class="dark" onclick="serverForget()">Submit</button><br><br>
    </form>
  </div>
  `)
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
      <button type="button" class="dark" onclick="serverSignup()">Submit</button><br><br>
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
          <td><p>or</p></td>
      </tr>
      <tr>
          <td><p><a href="#forget">Forget your password?</a></p></td>
      </tr>
      <tr>
          <button type="button" class="dark" id="submit" onclick="serverLogin()">Log In</button><br><br>
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

async function serverForget() {
  let user0 = Ui.id('usera').value
  let user1 = Ui.id('userb').value
  let email0 = Ui.id('emaila').value
  let email1 = Ui.id('emailb').value
  // console.log(user0)
  // console.log(user1)
  // console.log(email0)
  // console.log(email1)
  let r = await Server.post('/forget1', {user0, email0})
  if (user0==user1 & email0==email1) {
    console.log(user0)
    console.log(email0)
    //let r = await Server.post('/forget', {user0, email0})
    if (r.status== Status.OK) {
      console.log('serverForget: r=',r)
      let user2 = r.obj
      console.log('info=',user2.pass)
      alert(`Your password is:\n${user2.pass}`)
      Ui.goto('#login')
    }
  }
  else {
    alert('Not match')
  }
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
    if (localStorage.getItem('user')!= 'undefined') {
      localStorage.setItem('user', undefined)
      Ui.goto('#login')
    }
    else {
      alert('你根本沒登入!')
      Ui.goto('#login')
    }
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
    <div>
    <textarea class="typein" id="say" placeholder="${user} put something here!" maxlength=100></textarea>
      <br><button class="secondary" style="font-size: large" onclick="serverSayit(Ui.id('say').value)">Post</button></h2><br>
    </div>`)
  }
}

async function serverSayit(msg) {
  let user = localStorage.getItem('user')
  if (msg!="") {
    let r = await Server.post(`/msgAdd/${user}`, {msg})
    console.log(`sayit: user=${user} r=`, r)
    if (r.status == Status.OK) {
      Ui.goto(`#`)
      Ui.goto(`#home`)
    } else
      alert('貼文失敗!')
  }
  else {
    alert('空白貼文禁止')
  }
}

async function serverReplyAdd(mid) {
  // let user = localStorage.getItem('user')
  let msg = Ui.id('reply').value
  if (msg=="") {
    alert('空白回覆禁止')
    pass
  }
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
  html = html.replace(/#(\w+)/ig, "<a href='#msgKey/$1'>#$1</a>")
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
    <hr>
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
        <br><em class="time">${timeFormat(msg.time)}</em>
      </p>
    </div>
    `
}

function msgToHtmlForAdmin(msg) {
  return `
    <div class="title">
      <p>
        <em class="user"><a href="#msgBy/${msg.ufrom}">${msg.ufrom}</a></em> : 
        ${msgFormat(msg.msg)} 
        <br><em class="time">${timeFormat(msg.time)}</em>
      </p>
    </div>
    <button class="danger" onclick="serverDelete(${msg.mid})">Delete</button>
    `
}

async function msgGet(id) {
  let r = await Server.get(`/msgGet/${id}`)
  msg = r.obj
  Ui.show(`<div><button class="warning" onclick="Ui.goto('#home')">Back to home page</button></div>
  <div class="block"><h3>Original post:</h3>
    ${msgToHtml(msg)}\n
    <div>
      <textarea id="reply" class="rply" maxlength=100 placeholder="Reply here"></textarea>
      <br><button class="danger" onclick="serverReplyAdd(${msg.mid})">Reply</botton><br>
    </div>
    ${replysToHtml(msg.replys)}
    </div><br><br>
    <div><button class="warning" onclick="Ui.goto('#home')">Back to home page</button><br><br></div>
    `)
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
  <div class="block">
  <ul>${outs.join('\n<hr>')}</ul>
  </div>\n`)
}

async function allmsg() {
  let r = await Server.get('/msglist')
  let msgs = r.obj
  let outs = []
  let user = localStorage.getItem('user')
  for (let msg of msgs) {
    outs.push(msgToHtml(msg))
  }
  if(user=='undefined'||user==null){
    alert('Login to continue.')
    Ui.goto('#login')
  }
  else{
    Ui.show(`
    <div class="block">
      <h2>All Posts:</h2>
      ${outs.join('\n<hr>')}\n
    </div>
    
    `
    )
  }
}

async function msgList(op, user) {
  let r = await Server.get(`/msg${op}/${user}`)
  let poster = await Server.get(`/usercheck/${user}`)
  let msgs = r.obj
  let outs = []
  let luser = localStorage.getItem('user')
  for (let msg of msgs) {
    outs.push(msgToHtml(msg))
  }
  //console.log('outs=',outs)
  if(luser=='undefined'){
    alert('Login to continue.')
    Ui.goto('#login')
  }
  else if (poster.status!=Status.OK) {
    alert('User not exist.')
  }
  else{
      if (user==luser) {
        Ui.show(`
          <div class="block">
            <h2>(you)${user}'s Posts:</h2>
            ${outs.join('\n<hr>')}\n
          </div>
    `)}
    else {
      Ui.show(`
          <div class="block">
            <h2>${user}'s Posts:</h2>
            ${outs.join('\n<hr>')}\n
          </div>
    `)}}
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