import twilio from 'twilio';
import {createVerificationCode,readSidByPhoneNumber} from "../../6_data_layer/identity_verification.js";
import dotenv from "dotenv";
dotenv.config()

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;

const client = new twilio(accountSid, authToken);

// '+16205291752'



export async function sendVerificationCode(phone_number=Number) {


    const service = await client.verify.v2.services.create({
        friendlyName: 'TabCash'
    })

    await createVerificationCode({
        phone_number,
        sid: service.sid
    })

    await client.verify.v2.services(service.sid).verifications.create({
        to: `+2${phone_number}`,channel:'sms'
    })

}


export async function verificationChecks(Phone_Number=Number,code=Number) {

    try {
        const sid = await readSidByPhoneNumber(Phone_Number)


        const verification_check = await client.verify.v2.services(sid).verificationChecks.create({
            to: `+2${Phone_Number}`,code: `${code}`
        })

        if (verification_check.status != 'approved') return true
        else return false
    }
    catch (e) {
        return true
    }
}


