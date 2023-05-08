import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {checkForAClientSecret} from "../../6_data_layer/applications.js";
dotenv.config()


const app = express.Router()

app.post('/token',async (req,res)=>{

    // check data
    const client_id = req.body.client_id
    const client_secret = req.body.client_secret

    if (!client_id||!client_secret)
        return res.status(500).json({message: "Missing data"})

    try {
        // decryption
        let decryption ;

        try {
            decryption = await jwt.verify(client_id,process.env.api_secret)
        }catch (e) {
            return res.status(500).json({message:'Please login'})
        }

        // Create a client_secret
        if (await checkForAClientSecret(decryption.wallet,client_secret))
            return res.status(500).json({message:'Error Data'})

        // Create a token
        const token = await jwt.sign({wallet: decryption.wallet, name: decryption.name}, process.env.oauth2_secret,{expiresIn: "3h"})

        // send
        return res.json({
            token
        })
    }catch (e) {
        return res.status(500).json({message:'Something went wrong'})
    }

})











export default app