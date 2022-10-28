async function sqlRun() {
    let command = document.getElementById('command').value
    let final = document.getElementById('final')
    console.log(command)
    let r = await window.fetch(`/sqlcmd/${command}`)
    let obj = await r.json()
    final.innerText = JSON.stringify(obj, null, 2)
}