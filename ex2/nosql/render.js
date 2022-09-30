export function layout(datetime, content) {
  return `
  <html>
  <head>
    <title>${datetime}</title>
    <style>
      body {
        padding: 80px;
        font: 16px Helvetica, Arial;
      }
  
      h1 {
        font-size: 2em;
      }
  
      h2 {
        font-size: 1.2em;
      }
  
      #posts {
        margin: 0;
        padding: 0;
      }
  
      #posts li {
        margin: 40px 0;
        padding: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
        list-style: none;
      }
  
      #posts li:last-child {
        border-bottom: none;
      }
  
      textarea {
        width: 500px;
        height: 300px;
      }
  
      input[type=text],
      textarea {
        border: 1px solid #eee;
        border-top-color: #ddd;
        border-left-color: #ddd;
        border-radius: 2px;
        padding: 15px;
        font-size: .8em;
      }
  
      input[type=text] {
        width: 500px;
      }
    </style>
  </head>
  <body>
    <section id="content">
      ${content}
    </section>
  </body>
  </html>
  `
}

export function list(posts) {
  let list = []
  for (let post of posts) {
    list.push(`
    <li>
    <h2>${post.datetime}</h2>
    <h3>${post.title}</h3>
    <p><a href="/post/${post.id}">Read more</a></p>
    </li>
    `)
  }
  let content = `
  <h1>Events</h1>
  <p>You have <strong>${posts.length}</strong> events!</p>
  <p><a href="/post/new">Create a Event</a></p>
  <ul id="posts">
    ${list.join('\n')}
  </ul>
  `
  return layout('Posts', content)
}

export function newPost() {
  return layout('New Event', `
  <h1>New Event</h1>
  <p>Create a new event.</p>
  <form action="/post" method="post">
    <p><input type="text" placeholder="Title" name="title"></p>
    <p><input type="datetime-local" value="" name="datetime"></p>
    <p><textarea placeholder="Contents" name="body"></textarea></p>
    <p><input type="submit" value="Create"></p>
  </form>
  `)
}

export function show(post) {
  return layout(post.datetime, `
    <h1>${post.datetime}</h1>
    <h2>${post.title}</h2>
    <pre>${post.body}</pre>
    </br></br>
    <p><a href="/">Back to main page</a></p>
  `)
}
