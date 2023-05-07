import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {deposit} from "../4_shared_utilities_layer/transformation.js";
import conditions from "../4_shared_utilities_layer/conditions.js";

dotenv.config()


const app = express.Router()



app.patch('/deposit',async (req,res)=>{

    // Session verification
    const token = req.headers.authorization
    let user ;

    try {
        user = await jwt.verify(token,process.env.secret)
    }catch (e) {
        return res.status(500).json({message:'Please login'})
    }

    // Data verification
    const amount = req.body.amount
    const card_holder_name = req.body.card_holder_name
    const card_number = req.body.card_number
    const expiry_date = req.body.expiry_date
    const cvv = req.body.cvv
    const password = req.body.password

    if (
        !amount||
        !card_holder_name||
        !card_number||
        !expiry_date||
        !cvv||
        !password
    ) return res.status(500).json({message:'Missing data'})

    // Check the data pattern
    const amount_regex = /^[1-9]\d*$/.test(amount)
    const card_holder_name_regex = /^[a-zA-Z\s]+$/.test(card_holder_name)
    const card_number_regex = /^((4\d{3})|(5[1-5]\d{2})|(6011)|(7\d{3}))-?\d{4}-?\d{4}-?\d{4}|3[4,7]\d{13}$/.test(card_number)
    const expiry_date_regex = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(expiry_date)
    const cvv_regex = /^[0-9]{3,4}$/.test(cvv)
    const password_regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)

    if (
        !amount_regex||
        !card_holder_name_regex||
        !card_number_regex||
        !expiry_date_regex||
        !cvv_regex||
        !password_regex
    ) return res.status(500).json({message:'Data pattern error'})

    try {
        // Check conditions
        const rules = await conditions(user.wallet,password,amount)
        if (rules)
            return res.status(500).json({message: rules})

        // deposit
        const balance = await deposit(user.wallet,amount)

        // succeeded
        return res.json({
            message:'succeeded',
            new_balance: balance,
            status: true
        })
    }catch (e) {
        return res.status(500).json({message: "Something went wrong"})
    }
})









export default app
