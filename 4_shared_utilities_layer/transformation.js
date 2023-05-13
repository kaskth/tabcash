import {updateBalanceByPhoneNumber,readBalanceByPhoneNumber,readIdByPhoneNumber} from "../6_data_layer/wallets.js";
import {createTransaction} from "../6_data_layer/transactions.js";
import {readBalanceChildByPhoneNumber,readExpenseChildByPhoneNumber,updateExpenseChildByPhoneNumber,updateBalanceChildByPhoneNumber} from "../6_data_layer/childs.js";
import {readBalanceCreditCardsByPhoneNumber,updateCreditCardBalanceByPhoneNumber} from "../6_data_layer/creditcards.js";


export async function transferToWallet(sender,receiver,amount) {

    const sender_balance = await readBalanceByPhoneNumber(sender)
    const receiver_balance = await readBalanceByPhoneNumber(receiver)

    const new_sender_balance = parseInt(sender_balance) - parseInt(amount)
    const new_receiver_balance = parseInt(receiver_balance) + parseInt(amount)

    await updateBalanceByPhoneNumber(sender,new_sender_balance.toFixed(2))
    await updateBalanceByPhoneNumber(receiver,new_receiver_balance.toFixed(2))

    await createTransaction({
        wallets_id: await readIdByPhoneNumber(sender),
        wallets_phone_number:sender,
        company_name: null,
        description: `Transfer an amount to ${receiver}`,
        user_type:'main',
        transaction_type : 'transfer',
        sender_phone_number: sender,
        receiver_phone_number: receiver,
        amount ,
        status : 'success'
    })

}



export async function transferToSmartCard(phone_number,amount) {

    const wallet_balance = await readBalanceByPhoneNumber(phone_number)
    const smartCard_balance = await readBalanceCreditCardsByPhoneNumber(phone_number)
    console.log(wallet_balance)
    console.log(smartCard_balance)
    const new_wallet_balance = parseInt(wallet_balance) - parseInt(amount)
    const new_smartCard_balance = parseInt(smartCard_balance) + parseInt(amount)

    await updateBalanceByPhoneNumber(phone_number,new_wallet_balance.toFixed(2))
    await updateCreditCardBalanceByPhoneNumber(phone_number,new_smartCard_balance)

    await createTransaction({
        wallets_id: await readIdByPhoneNumber(phone_number),
        wallets_phone_number:phone_number,
        company_name: null,
        description: 'Transferred to a smart card',
        user_type:'main',
        transaction_type : 'transfer',
        sender_phone_number: 'my wallet',
        receiver_phone_number: 'my smart card',
        amount ,
        status : 'success'
    })

}


export async function transferMainToChild(main,child,amount) {

    const main_balance = await readBalanceByPhoneNumber(main)
    const child_balance = await readBalanceChildByPhoneNumber(child)
    const child_expanse = await readExpenseChildByPhoneNumber(child)

    const new_main_balance = parseInt(main_balance) - parseInt(amount)
    const new_child_balance = parseInt(child_balance) + parseInt(child_expanse)
    const new_child_expanse = parseInt(amount)

    let description = 'There is not enough balance to give the children money'
    let status = 'failure'

    if (parseInt(main_balance) >= parseInt(amount)){
        await updateBalanceByPhoneNumber(main,new_main_balance.toFixed(2))
        await updateBalanceChildByPhoneNumber(child,new_child_balance.toFixed(2))
        await updateExpenseChildByPhoneNumber(child,new_child_expanse.toFixed(2))
        description = 'Sending money to the children'
        status = 'success'
    }

    await createTransaction({
        wallets_id: await readIdByPhoneNumber(main),
        wallets_phone_number:main,
        company_name: null,
        description,
        user_type:'main',
        transaction_type : 'transfer',
        sender_phone_number: main,
        receiver_phone_number: child,
        amount ,
        status,
    })

}



export async function deposit(wallet_phone_number,amount) {

    const balance = await readBalanceByPhoneNumber(wallet_phone_number)
    const new_balance = parseInt(balance) + parseInt(amount)

    await updateBalanceByPhoneNumber(wallet_phone_number,new_balance)

    await createTransaction({
        wallets_phone_number: wallet_phone_number,
        wallets_id:await readIdByPhoneNumber(wallet_phone_number),
        description: "Deposit balance in the wallet",
        transaction_type:"deposit",
        sender_phone_number:"credit card",
        receiver_phone_number:wallet_phone_number,
        amount,
        status:"success",
    })

    return new_balance
}



export async function withdrawal(wallet_phone_number,amount,bank_account_number) {

    const balance = await readBalanceByPhoneNumber(wallet_phone_number)
    const new_balance = parseInt(balance) - parseInt(amount)

    await updateBalanceByPhoneNumber(wallet_phone_number,new_balance)

    await createTransaction({
        wallets_phone_number: wallet_phone_number,
        wallets_id:await readIdByPhoneNumber(wallet_phone_number),
        description: "Withdraw balance in the wallet",
        transaction_type:"withdrawal",
        sender_phone_number:"wallet",
        receiver_phone_number: `***********${bank_account_number.slice(-3)}`,
        amount,
        status:"success",
    })

    return new_balance
}