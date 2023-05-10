# Transfer API 

Transfer API is an Application Programming Interface (API) that provides the functionality to transfer funds between wallets of people registered in the application using their registered phone number. Users can make transfers from their personal accounts to other users' accounts in the application, and this process can be easily done using Transfer API. Access to this function includes confirmation of identity, minimum balance and validation of the phone number transferred to. The Transfer API enables application developers to integrate the transfer service into their applications in a simple and easy-to-use way.

| Method | Function              |
|-------:|-----------------------|
|  PATCH | to-wallet |


## to-wallet

Send money to another wallet.

PATCH :   https://tabcash.vercel.app/transactions/transfer/to-wallet

|   Parameter | Type         | Example     |
|------------:|--------------|-------------|
|  amount | number          | 1000        |
|  receiver | number          | 01064164392 |
|  password | number          | Kh12345678* |

### patterns
|   patterns | description         
|------------:|--------------
|  amount | An intger number greater than or equal to 50 and not more than 30,000           
|  receiver | The phone number of the wallet to which you want to send money          
|  password | Uppercase and lowercase letters, numbers and signs, and not less than 8 letters         


### message
|                                    message | description         
|-------------------------------------------:|--------------
|                               Please login | The token was not sent with the request, it is expired, or it is fake          
|                               Missing data | Make sure to enter all required parameters
|                              Invalid style | It seems that you entered an invalid data format. Look at the patterns table for the correct format          
|                             User not found | The user you want to send money to is not registered in the system         
|                             Error password | Incorrect password         
|                        Invalid transaction | Make sure that the value is equal to or more than 50 and not more than 30000         
| The maximum daily transfer limit is ...... | It seems that you have exceeded the daily transfer limit, which is 30,000       
|                       operation accomplished successfully | All is well   
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
PATCH /transactions/transfer/to-wallet
```
Example response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
    operation accomplished successfully
}
```
