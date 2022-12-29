import { DB } from "https://deno.land/x/sqlite/mod.ts";

let db = null
const NLIMIT = 100

export async function open() {
    db = new DB("say.db");
    db.query(`CREATE TABLE IF NOT EXISTS users 
                (uid INTEGER PRIMARY KEY AUTOINCREMENT, 
                user TEXT, pass TEXT, email TEXT)`)
    db.query(`CREATE TABLE IF NOT EXISTS msgs 
                (mid INTEGER PRIMARY KEY AUTOINCREMENT, 
                msg TEXT, ufrom TEXT, time INTEGER)`)
    db.query(`CREATE TABLE IF NOT EXISTS replys 
                (mid INTEGER, msg TEXT, user TEXT, time INTEGER)`)
    // https://www.sqlitetutorial.net/sqlite-full-text-search/
    // db.query(`CREATE VIRTUAL TABLE posts USING FTS5(title, body)`)
    db.query(`CREATE INDEX IF NOT EXISTS iUsers
            ON users (uid, user);`)
}

export async function clear() {
    db.query(`DELETE FROM users`)
    db.query(`DELETE FROM msgs`)
    db.query(`DELETE FROM follows`)
}

export async function close() {
    db.close()
}

export async function userAdd(user) {
    db.query(`INSERT INTO users (user, pass, email) VALUES (?,?,?)`, 
                        [user.user, user.pass, user.email])
}

export async function userGet(user1) {
    let q = db.query(`SELECT uid, user, pass, email FROM users 
                    WHERE user=?`, [user1])
    console.log(`userGet(${user1})=${q}`)
    if (q.length <=0) return null
    let [uid, user, pass, email] = q[0]
    return {uid, user, pass, email}
}

export function queryToUsers(q) {
    let users=[]
    for (let [uid, user, pass, email] of q) {
    users.push({uid, user, pass, email})
    }
    return users
}

export async function userForget(user1) {
    let q = db.query(`SELECT uid, user, pass, email FROM users 
                    WHERE user=?`, [user1])
    console.log(`userGet(${user1})=${q}`)
    console.log(queryToUsers(q)[0])
    return queryToUsers(q)[0]
}

export async function userList() {
    let q = db.query(`SELECT user FROM users`, [])
    let users = []
    for (let [user] of q) {
    users.push(user)
    }
    return users
}

export async function replyAdd(reply) {
    let time = reply.time || Date.now()
    db.query('INSERT INTO replys (mid, msg, user, time) VALUES (?,?,?,?)',
            [reply.mid, reply.msg, reply.user, time])
}

export async function msgAdd(msg) {
    let time=msg.time || Date.now()
    let r = db.query(`INSERT INTO msgs (msg, ufrom, time) VALUES (?,?,?)`, 
    [msg.msg, msg.ufrom, time])
    r = db.query('SELECT last_insert_rowid()')
    let mid = r[0][0]
    let replys = msg.replys || []
    for (let reply of replys) {
    reply.mid = mid
    replyAdd(reply)
    // r = db.query('INSERT INTO replys (mid, msg, user, time) VALUES (?,?,?,?)',
    //  [mid, reply.msg, reply.user, time])
    }
    return mid
}

export async function msgGet(mid) {
    let q = db.query(`SELECT mid, msg, ufrom, time
                    FROM msgs WHERE mid=?`, [mid])
    if (q.length <=0) return null
    let [_mid, msg, ufrom, time] = q[0]
    q = db.query(`SELECT msg, user, time FROM replys WHERE mid=? ORDER BY time ASC`, [mid])
    let replys = []
    for (let [msg, user, time] of q) {
    replys.push({msg, user, time})
    }
    return {mid, msg, ufrom, time, replys}
}

export function queryToMsgs(q) {
    let msgs = []
    for (let [mid, msg, ufrom, time] of q) {
    msgs.push({mid, msg, ufrom, time})
    }
    return msgs
}

export async function deleteMsg(mid) {
    db.query(`DELETE FROM msgs WHERE mid=${mid}`)
}

export async function msgS() {
    let q = db.query(`SELECT mid, msg, ufrom, time
                    FROM msgs ORDER BY time DESC LIMIT ${NLIMIT}`)
    return queryToMsgs(q)
}

export async function msgBy(user) {
    let q = db.query(`SELECT mid, msg, ufrom, time
            FROM msgs WHERE ufrom=? ORDER BY time DESC LIMIT ${NLIMIT}`, [user])
    // console.log(q)
    return queryToMsgs(q)
}

export async function msgKey(key) {
    let q = db.query(`SELECT mid, msg, ufrom, time FROM msgs 
                    WHERE LOWER(msg) LIKE '%${key.toLowerCase()}%'
                    ORDER BY time DESC LIMIT ${NLIMIT}`, [])
    return queryToMsgs(q)
}