import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password
})




///////////// create /////////////////

export async function createOrder(data=Object) {

    const applications_id  = data.applications_id
    const wallet = data.wallet
    const customer_id = data.customer_id
    const company_name = data.company_name
    const description = data.description
    const categories = data.categories
    const shipping = data.shipping || 0.00
    const tax = data.tax || 0.00
    const total_price = data.total_price
    const status = data.status || 'suspended'
    const success = data.success
    const fail = data.fail

    const sql = `
    insert into orders (applications_id,wallet,customer_id,company_name,description,categories,shipping,Tax,total_price,status,success,fail)
    values (${applications_id},'${wallet}','${customer_id}','${company_name}','${description}','${categories}',${shipping},${tax},${total_price},'${status}','${success}','${fail}')
    `

    const [rows] = await pool.execute(sql)

    return rows
}

///////////// read /////////////////

export async function readAllOrderByWalletPhoneNumber(wallet) {

    const sql =  `
    select id,company_name,description,categories,shipping,tax,total_price,status from orders 
    where wallet = ${wallet}
    `
    const [rows] = await pool.execute(sql)

    return rows
}

export async function readOrderById(order_id) {

    const sql =  `
    select id,company_name,description,categories,shipping,tax,total_price,status from orders 
    where id = ${order_id}
    `
    const [rows] = await pool.execute(sql)

    return rows
}

export async function readOrderStatus(order_id) {

    const sql =  `
    select status from orders 
    where id = ${order_id}
    `
    const [rows] = await pool.execute(sql)

    return rows[0].status
}


///////////// update /////////////////

export async function updateOrderStatus(order_id,status) {

    const sql =  `
    update orders 
    set status = '${status}'
    where id = ${order_id}
    `

    const snap = await pool.execute(sql)

    return true
}

///////////// delete /////////////////
///////////// check /////////////////

export async function checkForAOrder(order_id,wallet) {

    const sql =  `
    select id from orders 
    where id = ${order_id}
    and wallet = '${wallet}'
    `

    const [rows] = await pool.execute(sql)

    if (rows.length == 0) return  true
    else return false
}


///////////// math /////////////////