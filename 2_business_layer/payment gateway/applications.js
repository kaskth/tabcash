import express from "express";
import dotenv from "dotenv";
import {checkTheLimitsOfTheApplication,createApplication,checkTheLimitsOfTheApplicationName,readAllApplicationByWalletPhoneNumber} from "../../6_data_layer/applications.js";
import jwt from "jsonwebtoken";
import {readPasswordByPhoneNumber,readIdByPhoneNumber} from "../../6_data_layer/wallets.js";
import bcrypt from "bcrypt";
import crypto from "crypto"
dotenv.config()



const app = express.Router()




app.post('/create',async (req,res)=>{

    // Check session
    const token = req.headers.authorization
    let user ;

    try {
        user = await jwt.verify(token,process.env.secret)
    }catch (e) {
        return res.status(500).json({message:'Please login'})
    }
    const id = await readIdByPhoneNumber(user.wallet)

    // Check the data
    const name = req.body.name
    const password = req.body.password

    if (!name||!password) return res.status(500).json({message:"Missing data"})

    // Check the pattern
    const name_regex = /^[a-zA-Z]+$/.test(name)
    const password_regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)

    if (!name_regex||!password_regex) return res.status(500).json({message:"Data pattern error"})

    try {

        //check password
        const password_hash = await readPasswordByPhoneNumber(user.wallet)

        if (!await bcrypt.compare(password,password_hash))
            return res.status(500).json({message: 'Please check the information'})

        // Check the number of applications
        if (await checkTheLimitsOfTheApplication(user.wallet))
            return res.status(500).json({message: 'Maximum 10 applications'})

        // Check that the names of the same user match
        if (await checkTheLimitsOfTheApplicationName(user.wallet,name))
            return res.status(500).json({message:"The name cannot be used twice"})

        // create client_id & client_secret
        const client_id = await jwt.sign({wallet: user.wallet,name}, process.env.api_secret, { expiresIn: '1000 years' });
        const client_secret = await crypto.randomBytes(128).toString('hex');

        // Create an application
        await createApplication({
            wallets_id: id,
            wallets_phone_number: user.wallet,
            name,
            client_id,
            client_secret
        })

        // done
        res.json({
            message: "done",
            application: {
                name,
                client_id,
                client_secret
            },
            status: true,
        })
    }catch (e) {
        return res.status(500).send({message: "Something went wrong"})
    }
})



app.get('/read-all',async (req,res)=>{

    // Check session
    const token = req.headers.authorization
    let user ;

    try {
        user = await jwt.verify(token,process.env.secret)
    }catch (e) {
        return res.status(500).json({message:'Please login'})
    }

    try {
        // get all apps
        const apps = await readAllApplicationByWalletPhoneNumber(user.wallet)

        // send
        return res.json({
            apps
        })
    }catch (e) {
        return res.status(500).send({message: "Something went wrong"})
    }

})





export default app