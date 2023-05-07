import {
    mathTotalTransferForTheDay,
    readBalanceByPhoneNumber, readPasswordByPhoneNumber
} from "../6_data_layer/wallets.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config()



export default async function conditions(phone_number,password,amount,action=true){

    const balance = await readBalanceByPhoneNumber(phone_number)
    const totalTransferForTheDay = await mathTotalTransferForTheDay(phone_number)
    const password_hash = await readPasswordByPhoneNumber(phone_number)

    // Check password
    if (!await bcrypt.compare(password,password_hash))
        return 'Please check the information'


    // Check the amount
    else if (
        parseInt(amount) < process.env.jordanian_daily_transfer_limit||
        parseInt(amount) > process.env.maximum_daily_transfer_limit
    ) return `The minimum transaction amount is ${process.env.jordanian_daily_transfer_limit} and the maximum is ${process.env.maximum_daily_transfer_limit}`


    // Check wallet limit
    else if ((parseInt(balance) + parseInt(amount)) > process.env.wallet_limit && action)
        return `The maximum wallet balance size is ${process.env.wallet_limit}`


    // Check daily transaction volume
    else if ((parseInt(totalTransferForTheDay) + parseInt(amount)) > process.env.maximum_daily_transfer_limit)
        return "The daily limit for transaction has been exceeded"


    // Check for sufficient balance
    else if (parseInt(balance) < parseInt(amount) && !action)
        return "There is not enough balance to complete the transaction"

    else return false
}
