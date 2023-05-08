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

export async function createProduct(data=Object) {

    const orders_id = data.orders_id
    const name = data.name
    const description = data.description
    const price = data.price
    const quantity = data.quantity
    const link = data.link

    const sql = `
    insert into products (orders_id,name,description,price,quantity,link)
    values (${orders_id},'${name}','${description}','${price}','${quantity}','${link}')
    `

    const span = await pool.execute(sql)

    return true
}

////////////// read ////////////////

export async function readProductsByOrderId(order_id) {

    const sql =  `
    select * from  products
    where orders_id = ${order_id}
    `
    const [rows] = await pool.execute(sql)

    return rows
}


////////////// update ////////////////
////////////// delete ////////////////
////////////// check ////////////////
////////////// math ////////////////