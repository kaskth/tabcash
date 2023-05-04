import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password
})






///////////////// create //////////////////////

export async function createTransaction(data=Object) {

    const wallets_phone_number = data.wallets_phone_number
    const company_name = data.company_name || null
    const description = data.description || null
    const user_type = data.user_type || 'main'
    const transaction_type = data.transaction_type || 'transfer'
    const sender_phone_number = data.sender_phone_number
    const receiver_phone_number = data.receiver_phone_number
    const amount = data.amount
    const status = data.status

    const sql = `
    insert into transactions (wallets_phone_number,company_name,description,user_type,transaction_type,sender_phone_number ,receiver_phone_number,amount,status)
    values ('${wallets_phone_number}','${company_name}','${description}','${user_type}','${transaction_type}','${sender_phone_number}','${receiver_phone_number}','${amount}','${status}')
    `

    const snap = await pool.execute(sql)

    return true
}


///////////////// read //////////////////////
///////////////// update //////////////////////
///////////////// delete //////////////////////
///////////////// chack //////////////////////