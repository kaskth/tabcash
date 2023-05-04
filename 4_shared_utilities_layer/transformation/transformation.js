import {updateBalanceByPhoneNumber,readBalanceByPhoneNumber} from "../../6_data_layer/wallets.js";
import {createTransaction} from "../../6_data_layer/transactions.js";



export async function transferToWallet(sender,receiver,amount) {

    const sender_balance = await readBalanceByPhoneNumber(sender)
    const receiver_balance = await readBalanceByPhoneNumber(receiver)

    const new_sender_balance = parseInt(sender_balance) - parseInt(amount)
    const new_receiver_balance = parseInt(receiver_balance) + parseInt(amount)

    await updateBalanceByPhoneNumber(sender,new_sender_balance.toFixed(2))
    await updateBalanceByPhoneNumber(receiver,new_receiver_balance.toFixed(2))

    await createTransaction({
        wallets_phone_number:sender,
        company_name: null,
        description: null,
        user_type:'main',
        transaction_type : 'transfer',
        sender_phone_number: sender,
        receiver_phone_number: receiver,
        amount ,
        status : 'success'
    })

}