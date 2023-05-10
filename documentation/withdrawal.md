# withdrawal API

The Smart Wallet withdrawal API is for digital wallet and cryptocurrency applications. This interface aims to enable users to withdraw funds from their smart wallet in a safe and efficient manner.

| Method | Function              |
|-------:|-----------------------|
|  PATCH | withdrawal |


## withdrawal

Withdraw money from wallet to bank account.

PATCH :   https://tabcash.vercel.app/transactions/withdrawal

|   Parameter | Type   | Example        |
|------------:|--------|----------------|
|  amount | number | 100            |
|  bank_account_number | number   | 12345678900000 |
|  password | text | Kh12345678*    |

### patterns
|   patterns | description         
|------------:|--------------
|  amount | An intger number greater than or equal to 50 and not more than 30,000            
|  bank_account_number | 14 no          
|  password | Uppercase and lowercase letters, numbers and signs, and not less than 8 letters         


### message
|                                    message | description         
|-------------------------------------------:|--------------
|                               Please login | The token was not sent with the request, it is expired, or it is fake          
|                               Missing data | Make sure to enter all required parameters
|                              Invalid style | It seems that you entered an invalid data format. Look at the patterns table for the correct format          
|                            Please check the information | Incorrect password         
|                             The minimum transaction amount is | It is not possible to deposit an amount less than 50         
|                        The maximum wallet balance size is | The entered value does not estimate the capacity of the wallet. The capacity of the wallet is 100,000         
| The daily limit for transaction has been exceeded | The daily limit for transaction has been exceeded       
|                       There is not enough balance to complete the transaction |  There is not enough balance to complete the transaction   
|                       Something went wrong | A problem occurred in the server  

### Note
```
1- You must log in first
2- The amount must not be less than 50 and not more than 30,000
3- It is not possible to send more than 30,000 funds per day
```

### How can I send the token with the request?
When sending the token with the request, add it to the headers with the authorization variable


```
headers:
{
    authorization: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
}
```


Example request:
```
PATCH /transactions/deposit
```
Example response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
    message:'succeeded',
    new_balance: balance,
    status: true
}
```
