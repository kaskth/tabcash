import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password
})





/////////////////// create ////////////////////////

export async function createApplication(data=Object) {

    const wallets_id = data.wallets_id
    const wallets_phone_number = data.wallets_phone_number
    const name = data.name
    const client_id = data.client_id
    const client_secret = data.client_secret

    const sql = `
    insert into applications (wallets_id,wallets_phone_number,name,client_id,client_secret)
    values (${wallets_id},'${wallets_phone_number}','${name}','${client_id}','${client_secret}')
    `

    const span = await pool.execute(sql)

    return span
}


/////////////////// read ////////////////////////

export async function readAllApplicationByWalletPhoneNumber(wallets_phone_number) {

    const sql =  `
    select name,client_id,client_secret,created_at from applications 
    where wallets_phone_number = ${wallets_phone_number}
    and enabled = 'true'
    order by created_at DESC
    `
    const [rows] = await pool.execute(sql)

    return rows
}


export async function readIdByPhoneNumberAndName(wallets_phone_number,name) {

    const sql =  `
    select id from applications 
    where wallets_phone_number = ${wallets_phone_number}
    and name = '${name}'
    `
    const [rows] = await pool.execute(sql)

    return rows[0].id
}

/////////////////// update ////////////////////////

export async function updateEnabledByPhoneNumberAndName(wallet_phone_number,name,val) {

    const sql =  `
    update applications 
    set enabled = '${val}'
    where wallets_phone_number = ${wallet_phone_number}
    and name = '${name}'
    `
    const snap = await pool.execute(sql)

    return true

}

/////////////////// delete ////////////////////////

export async function deleteApplicationByName(wallets_phone_number,name) {

    const sql =  `
    DELETE FROM applications 
    WHERE wallets_phone_number = ${wallets_phone_number}
    and name = '${name}'
    `
try {
    const snap = await pool.execute(sql)

    return true
}catch (e) {
    console.log(e)
}

}

/////////////////// check ////////////////////////

export async function checkTheLimitsOfTheApplication(wallets_phone_number) {

    const sql =  `
    select wallets_phone_number from applications 
    where wallets_phone_number = ${wallets_phone_number}
    and enabled = 'true'
    `
    const [rows] = await pool.execute(sql)

    if (rows.length > 9) return true
    else return false
}

export async function checkTheLimitsOfTheApplicationName(wallets_phone_number,name) {

    const sql =  `
    select name from applications 
    where wallets_phone_number = ${wallets_phone_number}
    AND name = '${name}'
    `
    const [rows] = await pool.execute(sql)

    if (rows.length >= 1) return true
    else return false
}



export async function checkForAClientSecret(wallets_phone_number,client_secret) {

    const sql =  `
    select client_secret from applications 
    where wallets_phone_number = ${wallets_phone_number}
    AND client_secret = '${client_secret}'
    `

    const [rows] = await pool.execute(sql)

    if (rows.length == 0) return  true
    else return false
}

/////////////////// math ////////////////////////