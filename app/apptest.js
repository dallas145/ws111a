import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

function page(title,body,script){
  return`
  <!DOCTYPE html>
  <html>
    <head>
        <title>
            ${title}
        </title>
    </head>
    <style>
    body{
      background-color:#FDF5E6;
  }
  button{
    padding: 9px 16px;
      margin: 2px;
      background-color:#00FF00;
      color:white;
      border:2px #FDF5E6 solid;
      border-radius:5px;
      opacity:1;
      transition:0.4s;
      cursor: pointer;
  }
  
  .primary{
    background-color:#008000;
  }
  .primary:hover{
    background-color:#FFFFFF;
      color:#000000;
      border:2px #008000 solid;
  }
  .secondary{
    background-color:#708090;
  }
  .secondary:hover{
    background-color:#FFFFFF;
      color:#000000;
      border:2px #708090 solid;
  }
  .success{
    background-color:RoyalBlue;
  }
  .success:hover{
    background-color:#FFFFFF;
      color:#000000;
      border:2px RoyalBlue solid;
  }
  .danger{
    background-color:Maroon;
  }
  .danger:hover{
    background-color:DarkRed;
      border:2px Maroon solid;
  }
  .warning{
    background-color:Gold;
      color:black;
  }
  .warning:hover{
    background-color:#FFFFFF;
      color:black;
      border:2px Gold solid;
  }
  .info{
    background-color:SkyBlue;
      color:#F0FFFF
  }
  .info:hover{
    background-color:#FFFFFF;
      color:#0F0000;
      border:2px SkyBlue solid;
  }
  .light{
    background-color:#F0FFF0;
      color:#696969;
  }
  .light:hover{
    background-color:#E0EEE0;
      color:#414141;
      border:2px #D0DDD0 solid;
  }
  .dark{
    background-color:#0A2A0F;
      color:#FFFAFA;
  }
  .dark:hover{
    background-color:#2A4A2F;
      color:#FFFAFA;
      border:2px #09290E solid;
  }
  .login{
      width: 50%;
      text-align: center;
      background-color: #FFFFFF;
      border: 1px solid #000000;
      border-radius: 5px;
      margin: auto;
      margin-top: 50px;
      box-shadow: 0 10px 10px 0 rgba(0,0,0,0.15),0 10px 10px 0 rgba(0,0,0,0.19);
  }
  input[type=text],input[type="password"]{
      padding:5px 15px;
      margin:2px;
      width: 250px;
      border: 2px #808080 solid;
      border-radius: 10px; 
      background-color: #F8F8FF;
  }
  .topbar{
      list-style-type: none;
      overflow: hidden;
      margin: 0;
      padding: 0;
      background-color: rgb(17, 17, 17);
      border-radius: 5px;
  }
  .topbar a{
      float:left;
      color:#F8F8FF;
      text-align: center;
      padding: 11px 14px;
      text-decoration: none;
      font-size: 20px;
  }
  .topbar a:hover{
      background-color: rgb(204, 204, 204);
      color: rgb(17,17,17);
  }
  .topbar .ing{
      background-color: forestgreen;
      color: #F8F8FF;
  }
  .topbar .ing:hover{
      background-color: rgb(25, 94, 48);
      color: #F8F8FF;
  }
  .dropdown {
      float: left;
      overflow: hidden;
  }
  .dropdown .dropbtn {
      font-size: 20px;  
      border: none;
      outline: none;
      color: #F8F8FF;
      padding: 11px 14px;
      background-color: inherit;
      font-family: inherit;
      border-radius: 0;
      transition:0s;
      margin: 0;
  }
  .dropdown:hover .dropbtn{
      background-color: rgb(204, 204, 204);
      color: rgb(17,17,17);
  }
  .dropdown-content {
      display: none;
      position: absolute;
      background-color: #F8F8FF;
      min-width: 150px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
  }
  .dropdown-content a {
      float: none;
      color: rgb(17,17,17);
      padding: 11px 14px;
      text-decoration: none;
      display: block;
      text-align: left;
  }
  .dropdown:hover .dropdown-content {
      display: block;
  }
  .teksto{
      font-size: 35px;
      text-align: center;
  }
  .block{
      width: 50%;
      text-align: center;
      border: 1px solid #000000;
      border-radius: 5px;
      margin: auto;
      margin-top: 50px;
      box-shadow: 0 10px 10px 0 rgba(0,0,0,0.15),0 10px 10px 0 rgba(0,0,0,0.19);
  }
  
    </style>
    <body>
    ${body}
    </body>
    ${script}
  </html>
  `
}

app.use((ctx) => {
  let pathname = ctx.request.url.pathname;
  if(pathname.startsWith("/login")){
    ctx.response.body = page(
      `
      Login
      `
      ,
      `
      <div class="topbar">
            <a href="unu.html">Home</a>
            <a style="float: right;" href="pri.html">About</a>
            <a class="ing" style="float: right;" href="login.html">Log In</a>
            <div class="dropdown">
                <button class="dropbtn">Something</button>
                <div class="dropdown-content">
                    <a href="https://1hrbld.tw/intermediate-selection-panel/333-cube-notation/" target="_blank">Cubes: 轉動代號</a>
                    <a href="du.html">Cubes</a>
                    <a href="tri.html">Games</a>
                </div>
            </div>
        </div>
        <div class="login">
            <h1>Log In</h1>
            <tr>
                <td><p><input type="text" name="Username" value="" placeholder="Your Username" id="username"></p></td>
            </tr>
            <tr>
                <td><p><input type="password" name="password" value="" placeholder="Your Password" id="password"></p></td>
            </tr>
            <tr>
                <td><p><input type="checkbox" name="agree" id="check">Remember me</p></td>
                <td><p><a href="registri.html">Don't have an account?</a></p></td>
                <td><p>or</p></td>
                <td><p><a href="forget.html">Forget your password?</a></p></td>
            </tr>
            <tr>
                <button type="button" class="success" id="submit" onclick="myfunction()">Submit</button>
            </tr>
        </div>
      `
      ,
      `
      <script>
                    function myfunction(){
                        var c1=document.getElementById("username");
                        var c2=document.getElementById("password");
                        var c3=document.getElementById("check");
                        var t1="Your username is null.\n";
                        var t2="Your password is null.\n";
                        var t3="I don't think this is your username.\n";
                        var t4="I don't think this is your password.\n";
                        var t="";
                        if(c1.value==""){
                            t+=t1;
                        }
                        if(c2.value==""){
                            t+=t2;
                        }
                        if (c1.value.length<4)t+=t3;
                        if (c2.value.length<8)t+=t4;
                        if(c1.value==""||c2.value==""||c1.value.length<4||c2.value.length<8){
                            alert(t);
                        }
                        else if(c3.checked==true){
                            if(confirm("你確定要記住帳號與密碼嗎?")==true){
                                alert("系統尚未建置\n為您跳轉至首頁");
                                location="unu.html";
                            }
                            else {
                                alert("系統尚未建置\n為您跳轉至首頁");
                                location="unu.html";
                            }
                        }
                        else {
                                alert("系統尚未建置\n為您跳轉至首頁");
                                location="unu.html";
                            }
                    }
                </script>
      `
    )
  }
  else{
    ctx.response.body = page(
      `
      Home
      `
      ,
      `
      <div class="topbar">
            <a class="ing" href="#HOME">Home</a>
            <a style="float: right;" href="pri.html">About</a>
            <a style="float: right;" href="login.html">Log In</a>
            <div class="dropdown">
                <button class="dropbtn">Something</button>
                <div class="dropdown-content">
                    <a href="https://1hrbld.tw/intermediate-selection-panel/333-cube-notation/" target="_blank">Cubes: 轉動代號</a>
                    <a href="du.html">Cubes</a>
                    <a href="tri.html">Games</a>
                </div>
            </div>
        </div>
        <div class="teksto">
        <h1 class="teksto">This is the Home Page of My Site!</h1>
        <button class="primary" id="use" onclick="use()" style="font-size: 30px;">Useless Button</button>
        <div class="block">
            <p id="t"><br></p>
            <button class="primary" id="b" style="font-size: 30px" onclick="text()">Show</button>
        </div>
        <br><br><br><button class="danger" onclick="btn()">1</button><button class="warning" onclick="btn()">2</button><button class="light" onclick="btn()">3</button><button class="secondary" onclick="btn()">4</button><button class="success" onclick="btn()">5</button>
        <p id="tt"></p>
        </div> 
      `
      ,
      `
      <script>
        function use(){
          var u=document.getElementById("use");
          if (u.innerHTML=="Useless Button")document.getElementById("use").innerHTML="Useful button";
          else if (u.innerHTML=="Useful button")document.getElementById("use").innerHTML="Useless Button";
      }
      function text(){
          var t=document.getElementById("t");
          if (t.innerHTML=="<br>")t.innerHTML="This is useless.";
          else if (t.innerHTML!="")t.innerHTML="<br>";
          var b=document.getElementById("b");
          if (b.innerHTML=="Show")b.innerHTML="Hide";
          else if (b.innerHTML=="Hide")b.innerHTML="Show";
      }
      var n=0;
      function btn(){
          var t1="這個";
          var t2="網頁";
          var t3="沒有";
          var t4="任何";
          var t5="作用";
          if (n!=5)n+=1;
          else n=0;
          if (n==1)document.getElementById("tt").innerHTML+=t1;
          if (n==2)document.getElementById("tt").innerHTML+=t2;
          if (n==3)document.getElementById("tt").innerHTML+=t3;
          if (n==4)document.getElementById("tt").innerHTML+=t4;
          if (n==5)document.getElementById("tt").innerHTML+=t5;
          if (n==0)document.getElementById("tt").innerHTML="";
      }
      </script>
      `
    )
  }
});

console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 });

