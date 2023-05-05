import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password
})



///////////// create ///////////////////

export async function createChild(data=Object) {

    const phone_number = data.phone_number
    const first_name = data.first_name
    const last_name = data.last_name
    const password = data.password
    const age = data.age
    const balance = data.balance
    const expenses = data.expenses
    const type = data.type
    const next_batch_date = data.next_batch_date
    const wallets_id  = data.wallets_id
    const wallets_phone_number  = data.wallets_phone_number


    const sql = `
    insert into childs (phone_number,first_name,last_name,password,age,balance,expenses,type,next_batch_date,wallets_id,wallets_phone_number)
    values ('${phone_number}','${first_name}','${last_name}','${password}',${age},${balance},${expenses},'${type}','${next_batch_date}',${wallets_id},'${wallets_phone_number}')
    `

    const snap = pool.execute(sql)

    return true

}


///////////// read ///////////////////
///////////// update ///////////////////
///////////// delete ///////////////////
///////////// check ///////////////////
///////////// math ///////////////////