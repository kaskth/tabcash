import express from "express";
import {checkForAPhoneNumber,checkTheLimitsOfTheNationalId,createWallet,readPasswordByPhoneNumber,readDataUserByPhoneNumber} from "../6_data_layer/wallets.js";
import {verificationChecks} from "../3_service_layer/twilio/sendVerificationCode.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {createCreditCards} from "../6_data_layer/creditcards.js";
import generateCreditCard from "../4_shared_utilities_layer/generateCreditCard.js";

const app = express.Router()



app.post('/signup',async (req,res)=>{

    const phone_number = req.body.phone_number
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const password = req.body.password
    const national_ID = req.body.national_ID
    const expiration_date = req.body.expiration_date
    const date_of_birth  = req.body.date_of_birth
    const validation_code = req.body.validation_code

    if (!phone_number||!first_name||!last_name||!password||!national_ID||!expiration_date||!date_of_birth||!validation_code)
        return res.status(500).json({message:'Missing data'})

    const phone_number_regex  = /^01[0-2|5]{1}[0-9]{8}$/.test(phone_number)
    const first_name_regex  = /^[a-zA-Z]+$/.test(first_name)
    const last_name_regex  = /^[a-zA-Z]+$/.test(last_name)
    const password_regex  = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
    const national_ID_regex  = /^[0-9]{14}$/.test(national_ID)
    const expiration_date_regex  = /^(\d{4})-(\d{2})-(\d{2})$/.test(expiration_date)
    const date_of_birth_regex  = /^(\d{4})-(\d{2})-(\d{2})$/.test(date_of_birth)
    const validation_code_regex  = /^[0-9]{6}$/.test(validation_code)


    if (
        !phone_number_regex||
        !first_name_regex||
        !last_name_regex||
        !password_regex||
        !national_ID_regex||
        !expiration_date_regex||
        !date_of_birth_regex||
        !validation_code_regex
    ) return res.status(500).json({message:'Check the imposed patterns'})

    try {
        if (await checkForAPhoneNumber(phone_number)) return res.status(500).json({message:'The phone number has already been used'})

        if (await checkTheLimitsOfTheNationalId(national_ID)) return res.status(500).json({message:'We do not allow the use of the national number more than three times'})

        // if (await verificationChecks(phone_number,validation_code)) return res.status(500).json({message:'The verification code is invalid'})

        const passHash = await bcrypt.hash(password,10)

        const wallat = await createWallet({
            phone_number,
            first_name,
            last_name,
            password: passHash,
            national_ID,
            expiration_date,
            verification: 1,
            date_of_birth
        })

        const creditCard = await generateCreditCard()

        await createCreditCards({
            card_holder_name: `${first_name.toUpperCase()} ${last_name.toUpperCase()}`,
            card_number: creditCard.number,
            expiration:creditCard.expiration,
            cvv: creditCard.cvv,
            wallets_id: wallat.insertId,
            wallets_phone_number: phone_number
        })

        const token =  jwt.sign({wallet: phone_number}, process.env.secret, { expiresIn: process.env.token_time })

        return res.json({
            masseage: 'successfully registered',
            token,
            user: await readDataUserByPhoneNumber(phone_number),
            creditCard,
            status: true
        })
    }
    catch (e) {
        return res.send(e)
    }

})




app.post('/signin',async (req,res)=>{


    if (req.headers.authorization) return res.status(500).json({message: 'There is already a session'})

    const phone_number = req.body.phone_number
    const password = req.body.password
    const validation_code = req.body.validation_code

    if (!phone_number||!password||!validation_code) return res.status(500).json({message: 'Missing data'})

    const phone_number_regex  = /^01[0-2|5]{1}[0-9]{8}$/.test(phone_number)
    const password_regex  = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
    const validation_code_regex  = /^[0-9]{6}$/.test(validation_code)

    if (
        !phone_number_regex||
        !password_regex||
        !validation_code_regex
    ) return res.status(500).json({message: 'Invalid style'})


    try {
        if (!await checkForAPhoneNumber(phone_number))
            return res.status(500).json({message: 'Unregistered user'})

        const password_hash = await readPasswordByPhoneNumber(phone_number)

        if (!await bcrypt.compare(password,password_hash))
            return res.status(500).json({message: 'Please check the information'})


        if (await verificationChecks(phone_number,validation_code))
            return res.status(500).json({message: 'The verification code is invalid'})


        const token =  jwt.sign({wallet: phone_number}, process.env.secret, { expiresIn: process.env.token_time })

        return res.json({
            masseage: 'successfully',
            token,
            user: await readDataUserByPhoneNumber(phone_number),
            status: true
        })
    }
    catch (e) {
        return res.status(500).send({message: "Something went wrong"})
    }

})



export default app