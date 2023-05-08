import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password
})




////////////// create ////////////////

export async function createAddress(data=Object) {

    const orders_id = data.orders_id
    const phone_number = data.phone_number
    const governorate = data.governorate
    const region = data.region
    const street = data.street
    const building = data.building
    const other = data.other

    const sql = `
    insert into addresses (orders_id,phone_number,governorate,region,street,building,other)
    values (${orders_id},'${phone_number}','${governorate}','${region}','${street}','${building}','${other}')
    `

    const [rows] = await pool.execute(sql)

    return rows
}

////////////// read ////////////////

export async function readAddressByOrderId(order_id) {

    const sql =  `
    select * from  addresses
    where orders_id = ${order_id}
    `
    const [rows] = await pool.execute(sql)

    return rows
}


////////////// update ////////////////
////////////// delete ////////////////
////////////// check ////////////////
////////////// math ////////////////