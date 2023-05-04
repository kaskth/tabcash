import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password
})




/////////////// create ////////////////////////

export async function createVerificationCode(data=Object) {

    const phone_number = data.phone_number
    const sid = data.sid
    const type = data.type || 'phone'


    const sql = `
    INSERT INTO identity_verification (Phone_Number,sid,type)
    VALUES ('${phone_number}','${sid}','${type}')
    `

    await pool.execute(sql)

    return true
}

/////////////// read ////////////////////////

export async function readSidByPhoneNumber(Phone_Number) {

    const sql = `
    select sid from identity_verification 
    where phone_number = '${Phone_Number}'
    order by created_at DESC
    limit 1
    `

    const [rows] = await pool.execute(sql)

    return rows[0].sid
}

/////////////// update ////////////////////////
/////////////// delete ////////////////////////