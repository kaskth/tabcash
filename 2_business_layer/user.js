import express from 'express'
import jwt from "jsonwebtoken";
import {readDataChildsByPhoneNumber} from "../6_data_layer/childs.js";
import {readAllApplicationByWalletPhoneNumber} from "../6_data_layer/applications.js";
import {mathTotalTransfer,readDataTransactionsByPhoneNumber} from "../6_data_layer/transactions.js";
import {readDataUserByPhoneNumberV2} from "../6_data_layer/wallets.js";
import {readCreditCardsByPhoneNumber} from "../6_data_layer/creditcards.js";


const app = express.Router()



app.get('/data',async (req,res)=>{

    // check session
    const token = req.headers.authorization
    let user ;

    try {
        user = await jwt.verify(token,process.env.secret)
    }catch (e) {
        return res.status(500).json({message:'Please login'})
    }

    try {
        res.json({
            wallet: await readDataUserByPhoneNumberV2(user.wallet),
            creditcard: await readCreditCardsByPhoneNumber(user.wallet),
            history: {
                balance: await mathTotalTransfer(user.wallet),
                transations: await readDataTransactionsByPhoneNumber(user.wallet)
            },
            kids: await readDataChildsByPhoneNumber(user.wallet),
            apps:await readAllApplicationByWalletPhoneNumber(user.wallet)
        })
    }
    catch (e) {
        return res.status(500).json({message:e})
    }


})











export default app