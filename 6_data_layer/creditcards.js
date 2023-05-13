import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password
})




//////////// create ////////////////////

export async function createCreditCards(data=Object) {

    const card_holder_name = data.card_holder_name
    const card_number = data.card_number
    const expiration = data.expiration
    const cvv = data.cvv
    const wallets_id = data.wallets_id
    const wallets_phone_number = data.wallets_phone_number

    const sql = `
    insert into creditcards (card_holder_name,card_number,expiration,cvv,wallets_id,wallets_phone_number)
    values ('${card_holder_name}','${card_number}','${expiration}','${cvv}',${wallets_id},'${wallets_phone_number}')
    `
    const span = await pool.execute(sql)

    return true

}


//////////// read ////////////////////


export async function readCreditCardsByPhoneNumber(wallets_phone_number ) {

    const sql =  `
    select * from creditcards 
    where wallets_phone_number  = ${wallets_phone_number}
    `

    const [rows] = await pool.execute(sql)

    return rows[0]
}

export async function readBalanceCreditCardsByPhoneNumber(wallets_phone_number) {

    const sql =  `
    select balance from creditcards 
    where wallets_phone_number = ${wallets_phone_number}
    `
    const [rows] = await pool.execute(sql)

    return rows[0].balance
}

//////////// update ////////////////////

export async function updateCreditCardBalanceByPhoneNumber(wallets_phone_number ,balance) {

    const sql =  `
    update creditcards 
    set balance = ${balance}
    where wallets_phone_number  = ${wallets_phone_number}
    `

    const snap = await pool.execute(sql)

    return true
}

//////////// delete ////////////////////
//////////// check ////////////////////
//////////// math ////////////////////