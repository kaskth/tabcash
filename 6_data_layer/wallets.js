import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password
})




////////////////// create ///////////////////////

export async function createWallet(data=Object){

    const phone_number = data.phone_number
    const first_name   = data.first_name
    const last_name = data.last_name
    const password = data.password
    const national_ID = data.national_ID
    const expiration_date = data.expiration_date
    const verification = data.verification
    const date_of_birth  = data.date_of_birth

    const sql = `insert into wallets (phone_number,first_name,last_name,password,national_ID,expiration_date,verification,date_of_birth) 
    VALUES ('${phone_number}','${first_name}','${last_name}','${password}',${national_ID},'${expiration_date}',${verification},'${date_of_birth}')
`

    const [rows, fields] = await pool.query(sql)

    return true
}

////////////////// read ///////////////////////

export async function readPasswordByPhoneNumber(phone_number) {

    const sql =  `
    select password from wallets 
    where phone_number = ${phone_number}
    `

    const [rows] = await pool.execute(sql)

    return rows[0].password
}

export async function readBalanceByPhoneNumber(phone_number) {

    const sql =  `
    select balance from wallets 
    where phone_number = ${phone_number}
    `

    const [rows] = await pool.execute(sql)

    return rows[0].balance
}

export async function readIdByPhoneNumber(phone_number) {

    const sql =  `
    select id from wallets 
    where phone_number = ${phone_number}
    `

    const [rows] = await pool.execute(sql)

    return rows[0].id
}

////////////////// update ///////////////////////

export async function updateBalanceByPhoneNumber(phone_number,balance) {

    const sql =  `
    update wallets 
    set balance = ${balance}
    where phone_number = ${phone_number}
    `

    const snap = await pool.execute(sql)

    return true
}

////////////////// delete ///////////////////////
////////////////// check ///////////////////////


export async function checkForAPhoneNumber(phone_number) {

    const sql =  `
    select phone_number from wallets 
    where phone_number = ${phone_number}
    `

    const [rows] = await pool.execute(sql)

    if (rows.length == 0) return  false
    else return true
}

export async function checkTheLimitsOfTheNationalId(national_ID) {

    const sql =  `
    select national_ID from wallets 
    where national_ID = ${national_ID}
    `

    const [rows] = await pool.execute(sql)

    if (rows.length > 2) return true
    else return false
}


////////////////// math ///////////////////////

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
