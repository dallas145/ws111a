import { DB } from "https://deno.land/x/sqlite/mod.ts";

try {
    Deno.remove("mydb.db")
}catch(e){
    console.log("file not exit!")
}
const db = new DB("mydb.db")
while (true) {
    let command = prompt('sql?')
    if (command=='exit') break
    try {
        let r = db.query(command)
        console.log(r)
    } catch (error) {
        console.log('error=', error)
    }
}
