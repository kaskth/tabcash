import express from "express";
import {sendVerificationCode} from "../4_shared_utilities_layer/twilio/sendVerificationCode.js";

const app = express.Router()



app.post('/sms-verification',async (req,res)=>{

    const phone_number = req.body.phone_number

    if (!phone_number) return res.status(500).send('Missing data')


    const phone_number_regex  = /^01[0-2|5]{1}[0-9]{8}$/.test(phone_number)

    if (!phone_number_regex) return res.status(500).send('Error in number pattern')

    try {
        // await sendVerificationCode(phone_number)

        res.send('Verification message has been sent successfully')
    }
    catch (e) {
        return res.status(500).send('Something went wrong')
    }

})



export default app