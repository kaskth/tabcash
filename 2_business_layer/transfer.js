import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import {checkForAPhoneNumber,readPasswordByPhoneNumber,readBalanceByPhoneNumber,mathTotalTransferForTheDay} from "../6_data_layer/wallets.js";
import {transferToWallet} from "../4_shared_utilities_layer/transformation.js";

const app = express.Router()
dotenv.config()




app.patch('/transfer/to-wallet',async (req,res)=>{

    // check session
    const token = req.headers.authorization
    let user ;

    try {
        user = await jwt.verify(token,process.env.secret)
    }catch (e) {
        return res.status(500).json({message:'Please login'})
    }

    // check data
    let amount = req.body.amount
    const receiver = req.body.receiver
    const password = req.body.password

    if (!amount||!receiver||!password) return res.status(500).json({message:'Missing data'})

    // check data pattern
    const amout_regex = /^[1-9]\d*$/.test(amount)
    const receiver_regex  = /^01[0-2|5]{1}[0-9]{8}$/.test(receiver)
    const password_regex  = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)

    if (
        !amout_regex||
        !receiver_regex||
        !password_regex
    ) return res.status(500).json({message:'Invalid style'})

    try {

        // check user
        if (!await checkForAPhoneNumber(user.wallet) && !await checkForAPhoneNumber(receiver))
            return res.status(500).json({message:'User not found'})

        // check password
        if (!await bcrypt.compare(password,await readPasswordByPhoneNumber(user.wallet)))
            return res.status(500).json({message:'Error password'})

        // Check transaction laws
        amount = parseInt(amount)
        const sender_balance = parseInt(await readBalanceByPhoneNumber(user.wallet))
        const receiver_balance = parseInt(await readBalanceByPhoneNumber(receiver))

        if (amount < process.env.jordanian_daily_transfer_limit && amount > process.env.maximum_daily_transfer_limit)
            return res.status(500).json({message:'Invalid transaction'})
        if (sender_balance < amount) return res.status(500).json({message:'Make sure you have enough balance'})
        if ((receiver_balance + amount) > process.env.wallet_limit) return res.status(500).json({message:'Invalid transaction'})

        // Check daily transactions
        const total_amount = await mathTotalTransferForTheDay(user.wallet)

        if ((parseInt(total_amount) + amount) > process.env.maximum_daily_transfer_limit)
            return res.status(500).json({
                messages:`The maximum daily transfer limit is ${process.env.maximum_daily_transfer_limit}`,
                total_daily_conversions: process.env.maximum_daily_transfer_limit,
                it_can_be_used:  process.env.maximum_daily_transfer_limit - total_amount
            })

        // transfer
        await transferToWallet(user.wallet,receiver,amount)

        return res.json({message:'operation accomplished successfully'})
    }catch (e) {
        return res.status(500).json({message:'Something went wrong'})
    }


})



export default app