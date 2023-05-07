import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import conditions from "../4_shared_utilities_layer/conditions.js";
import {withdrawal} from "../4_shared_utilities_layer/transformation.js";
dotenv.config()


const app = express.Router()



app.patch('/withdrawal',async (req,res)=>{


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
    const bank_account_number = req.body.bank_account_number
    const password = req.body.password

    if (
        !amount||
        !bank_account_number||
        !password
    ) return res.status(500).json({message:'Missing data'})

    // Check the data pattern
    const amount_regex = /^[1-9]\d*$/.test(amount)
    const bank_account_number_regex = /^\d{14}$/.test(bank_account_number)
    const password_regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)

    if (
        !amount_regex||
        !bank_account_number_regex||
        !password_regex
    ) return res.status(500).json({message:"Data pattern error"})


    try {
        // Check conditions
        const rules = await conditions(user.wallet,password,amount,false)
        if (rules)
            return res.status(500).json({message: rules})

        // withdrawal
        const balance = await withdrawal(user.wallet,amount,bank_account_number)

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
