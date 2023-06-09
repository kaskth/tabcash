import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {readIdByPhoneNumber, checkForAPhoneNumber, readPasswordByPhoneNumber} from "../6_data_layer/wallets.js";
import {checkChildForAPhoneNumber,createChild,deleteChildByPhoneNumber,updateExpenseAndTypeChildByPhoneNumber} from "../6_data_layer/childs.js";
import {transferMainToChild} from "../4_shared_utilities_layer/transformation.js";
dotenv.config()

const app = express.Router()



app.post('/create',async (req,res)=>{

    // Verify the session
    const token = req.headers.authorization
    let user ;

    try {
        user = await jwt.verify(token,process.env.secret)
    }catch (e) {
        return res.status(500).json({message:'Please login'})
    }

    // Data verification
    const phone_number = req.body.phone_number
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const password = req.body.password
    const age = req.body.age
    const expense = req.body.expense
    const type = req.body.type
    // const next_batch_date = req.body.next_batch_date
    const wallets_id = await readIdByPhoneNumber(user.wallet)
    const wallets_phone_number = user.wallet
    const category = req.body.category

    if (
        !phone_number||
        !first_name||
        !last_name||
        !password||
        !age||
        !expense||
        !type||
        // !next_batch_date||
        !wallets_id||
        !wallets_phone_number||
        !category
    ) return res.status(500).json({message:'Missing Data'})

    // Check the data pattern
    const phone_number_regex = /^01[0-2|5]{1}[0-9]{8}$/.test(phone_number)
    const first_name_regex = /^[a-zA-Z]+$/.test(first_name)
    const last_name_regex = /^[a-zA-Z]+$/.test(last_name)
    const password_regex = /^[a-zA-Z0-9]{8,45}$/.test(password)
    const age_regex = /^1[0-6]$/.test(age)
    const expense_regex = /^[1-9]\d*$/.test(expense)
    const type_regex = /^(daily|weekly|monthly|none)$/.test(type)
    // const next_batch_date_regex = /^(\d{4})-(\d{2})-(\d{2})$/.test(next_batch_date)
    const wallets_id_regex = /\b\d+\b/.test(wallets_id)
    const wallets_phone_number_regex = /^01[0-2|5]{1}[0-9]{8}$/.test(wallets_phone_number)
    const category_regex = Array.isArray(category)

    if (
        !phone_number_regex||
        !first_name_regex||
        !last_name_regex||
        !password_regex||
        !age_regex||
        !expense_regex||
        !type_regex||
        // !next_batch_date_regex||
        !wallets_id_regex||
        !wallets_phone_number_regex||
        !category_regex
    ) return res.status(500).json({message:'Invalid style'})

    // Check data categories
    const all_category = ["Clothes and Fashion", "Electronics", "Furniture, Home and Decoration", "Beauty and Personal Care", "Household Tools and Equipment", "Games and Electronic Games", "Books and Publications", "Sports and Fitness", "Jewelry and Watches", "Food and Drinks", "Health and Wellness", "Games and Hobbies", "Travel and Tourism", "Pets and Their Supplies", "Gifts and Special Occasions"]

    const isSame = category.every(value => all_category.includes(value))

    if (!isSame) return res.status(500).json({message:'categories are not supported'})

    try {
        // Verify that users exist
        if (
            await checkForAPhoneNumber(phone_number) ||
            !await checkForAPhoneNumber(wallets_phone_number) ||
            await checkChildForAPhoneNumber(phone_number)
        ) return res.status(500).json({message:'The phone number has already been used'})


        // Check laws
        if (
            parseInt(expense) < process.env.jordanian_daily_transfer_limit||
            parseInt(expense) > process.env.maximum_daily_transfer_limit
        ) return res.status(500).json({message:'Invalid expense'})

        // create
        await createChild({
            phone_number,
            first_name,
            last_name,
            password: await bcrypt.hash(password,10),
            age,
            type,
            // next_batch_date,
            wallets_id,
            wallets_phone_number,
            category
        })

        // Send money
        await transferMainToChild(wallets_phone_number,phone_number,expense)

        // done
        return res.json({message:'done'})
    }catch (e) {
        return res.json({message:'Something went wrong'})
    }



})




app.patch('/update',async (req,res)=>{

    // Verify the session
    const token = req.headers.authorization
    let user ;

    try {
        user = await jwt.verify(token,process.env.secret)
    }catch (e) {
        return res.status(500).json({message:'Please login'})
    }


    // check data
    const child_phone_number = req.body.child_phone_number
    const expense  = req.body.expense
    const type  = req.body.type
    const password = req.body.password

    if (
        !child_phone_number||
        !expense||
        !type||
        !password
    ) return res.status(500).json({message:"Missing data"})


    // check data pattern
    const child_phone_number_regex = /^01[0-2|5]{1}[0-9]{8}$/.test(child_phone_number)
    const expense_regex = /^[1-9]\d*$/.test(expense)
    const type_regex = /^(daily|weekly|monthly|none)$/.test(type)
    const password_regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)

    if (
        !child_phone_number_regex||
        !expense_regex||
        !type_regex||
        !password_regex
    ) return res.status(500).json({message:"Data pattern error"})

    try {

        // check password
        if (!await bcrypt.compare(password,await readPasswordByPhoneNumber(user.wallet)))
            return res.status(500).json({message:'Error password'})

        // update
        await updateExpenseAndTypeChildByPhoneNumber(child_phone_number,user.wallet,expense,type)

        // done
        res.send('done')

    }catch (e) {
        return res.status(500).json({message:'Something went wrong'})
    }

})





app.post('/delete',async (req,res)=>{

    // Verify the session
    const token = req.headers.authorization
    let user ;

    try {
        user = await jwt.verify(token,process.env.secret)
    }catch (e) {
        return res.status(500).json({message:'Please login'})
    }


    // check data
    const child_phone_number = req.body.child_phone_number
    const password = req.body.password


    if (
        !child_phone_number||
        !password
    ) return res.status(500).json({message:"Missing data"})


    // check data pattern
    const child_phone_number_regex = /^01[0-2|5]{1}[0-9]{8}$/.test(child_phone_number)
    const password_regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)

    if (
        !child_phone_number_regex||
        !password_regex
    ) return res.status(500).json({message:"Data pattern error"})

    try {

        // check password
        if (!await bcrypt.compare(password,await readPasswordByPhoneNumber(user.wallet)))
            return res.status(500).json({message:'Error password'})

        // delete
        await deleteChildByPhoneNumber(child_phone_number,user.wallet)

        // done
        res.send('done')

    }catch (e) {
        return res.status(500).json({message:'Something went wrong'})
    }

})




export default app