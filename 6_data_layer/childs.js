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
    const balance = data.balance || 0.00
    const expense = data.expense || 0.00
    const type = data.type
    const next_batch_date = data.next_batch_date || null
    const wallets_id  = data.wallets_id
    const wallets_phone_number  = data.wallets_phone_number
    const category  = data.category


    const sql = `
    insert into childs (phone_number,first_name,last_name,password,age,balance,expense,type,next_batch_date,wallets_id,wallets_phone_number,category)
    values ('${phone_number}','${first_name}','${last_name}','${password}',${age},${balance},${expense},'${type}','${next_batch_date}',${wallets_id},'${wallets_phone_number}','${category}')
    `

    const snap = pool.execute(sql)

    return true

}


///////////// read ///////////////////

export async function readBalanceChildByPhoneNumber(phone_number) {

    const sql =  `
    select balance from childs 
    where phone_number = ${phone_number}
    `

    const [rows] = await pool.execute(sql)

    return rows[0].balance
}

export async function readExpenseChildByPhoneNumber(phone_number) {

    const sql =  `
    select expense from childs 
    where phone_number = ${phone_number}
    `

    const [rows] = await pool.execute(sql)

    return rows[0].expense
}


export async function readDataChildsByPhoneNumber(wallets_phone_number) {

    const sql =  `
    select phone_number,first_name,last_name,age,expense as balance,type from childs 
    where wallets_phone_number = ${wallets_phone_number}
    `

    const [rows] = await pool.execute(sql)

    return rows
}


///////////// update ///////////////////
export async function updateBalanceChildByPhoneNumber(phone_number,balance) {

    const sql =  `
    update childs 
    set balance = ${balance}
    where phone_number = ${phone_number}
    `

    const snap = await pool.execute(sql)

    return true
}

export async function updateExpenseChildByPhoneNumber(phone_number,expense) {

    const sql =  `
    update childs 
    set expense = ${expense}
    where phone_number = ${phone_number}
    `

    const snap = await pool.execute(sql)

    return true
}


export async function updateExpenseAndTypeChildByPhoneNumber(phone_number,wallets_phone_number,expense,type) {

    const sql =  `
    update childs 
    set expense = ${expense},
    type = '${type}'
    where phone_number = ${phone_number}
    and wallets_phone_number = ${wallets_phone_number}
    `
    const snap = await pool.execute(sql)

    return true

}


///////////// delete ///////////////////

export async function deleteChildByPhoneNumber(phone_number,wallets_phone_number) {

    const sql =  `
    DELETE FROM childs 
    WHERE phone_number = ${phone_number}
    and wallets_phone_number = ${wallets_phone_number}
    `

    const snap = await pool.execute(sql)

    return true
}

///////////// check ///////////////////

export async function checkChildForAPhoneNumber(phone_number) {

    const sql =  `
    select phone_number from childs 
    where phone_number = ${phone_number}
    `

    const [rows] = await pool.execute(sql)

    if (rows.length == 0) return  false
    else return true
}

///////////// math ///////////////////