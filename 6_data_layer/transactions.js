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
    const wallets_id  = data.wallets_id
    const company_name = data.company_name || 'Tab Cash'
    const description = data.description || 'Transaction'
    const user_type = data.user_type || 'main'
    const transaction_type = data.transaction_type || 'transfer'
    const sender_phone_number = data.sender_phone_number
    const receiver_phone_number = data.receiver_phone_number
    const amount = data.amount
    const status = data.status

    const sql = `
    insert into transactions (wallets_phone_number,wallets_id ,company_name,description,user_type,transaction_type,sender_phone_number ,receiver_phone_number,amount,status)
    values ('${wallets_phone_number}',${wallets_id},'${company_name}','${description}','${user_type}','${transaction_type}','${sender_phone_number}','${receiver_phone_number}','${amount}','${status}')
    `

    const snap = await pool.execute(sql)

    return true
}


///////////////// read //////////////////////

export async function readDataTransactionsByPhoneNumber(wallets_phone_number) {

    const sql =  `
    select description,amount,created_at as date,transaction_type as type from transactions 
    where wallets_phone_number = ${wallets_phone_number}
    order by created_at DESC
    `

    const [rows] = await pool.execute(sql)

    return rows
}


///////////////// update //////////////////////
///////////////// delete //////////////////////
///////////////// chack //////////////////////
///////////////// math //////////////////////
export async function mathTotalTransferForTheDay(phone_number) {

    const sql =  `
    SELECT SUM(amount) AS total_amount 
    FROM transactions 
    WHERE DATE(created_at) = CURDATE()
    AND wallets_phone_number = ${phone_number}
    AND transaction_type = 'transfer'
    `

    const [rows] = await pool.execute(sql)

    return rows[0].total_amount
}


export async function mathTotalTransfer(phone_number) {

    const sql =  `
    SELECT SUM(amount) AS total_amount 
    FROM transactions 
    WHERE wallets_phone_number = ${phone_number}
    `

    const [rows] = await pool.execute(sql)

    return rows[0].total_amount
}