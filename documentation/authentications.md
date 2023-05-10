# Authentications API 

Authentications in a cryptocurrency wallet with a phone number is one of the common ways to confirm a user's identity and protect their account. This method involves entering the user's phone number when creating the account, and sending a verification code that is entered to confirm the user's identity. Authentications are used to protect the user's account from hacking and fraud, and can also be used to reset the password or change some other settings in the account.

| Method | Function |
|-------:|--------|
|    Post | signup |
|   Post | signin |


## Accounts can be used for experiment
| Phone Number | Password |
|-------------:|----------|
|         01153300178 | Kh12345678*   |
|         01064164392 | Kh12345678*   |


## signup

Subscribe to a smart wallet.

Post :  https://tabcash.vercel.app/authentications/signup

### Parameter
|   Parameter | Type         | Example          |
|------------:|--------------|------------------|
|  phone_number | number          | 01153300178      |
| first_name | text | Mohamed          |
|  last_name | text         | Khaled |
|  password | text         | Kh12345678*           |
|  national_ID | text         | 29812270105894   |
|  expiration_date | date         | 2024-05-10 |
|  date_of_birth | date         | 1998-12-27 |
|  validation_code | text         | 873141 |


### patterns
|   patterns | description         
|------------:|--------------
|  phone_number | An Egyptian phone number consisting of 11 digits          
| first_name | normal name 
|  last_name | normal name         
|  password | Uppercase and lowercase letters, numbers and signs, and not less than 8 letters         
|  national_ID | A natural national number is 14 digits         
|  expiration_date | Date like 2024-05-10 in this style         
|  date_of_birth | Date like 2024-05-10 in this style         
|  validation_code | A real 6-digit verification number that does not expire         


### message
|   message | description         
|------------:|--------------
|  Missing data | Make sure to enter all required parameters          
| Check the imposed patterns | It seems that you entered an invalid data format. Look at the patterns table for the correct format 
|  The phone number has already been used | It is not possible to register with the same phone number twice         
|  We do not allow the use of the national number more than three times | The card number can be associated with only three accounts         
|  The verification code is invalid | It seems that the verification code has expired. It is invalid         
|  successfully registered | All is well         
|  Something went wrong | A problem occurred in the server         


### Note
```
Token time is only 24 hours
```


Example request:
```
Post /authentications/signup
```
Example response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
 masseage: 'successfully registered',
 token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
}
```


## signin

It enables you to log in for 24 hours. 

Post :  https://tabcash.vercel.app/authentications/signin

|   Parameter | Type                  | Example         |
|------------:|-----------------------|-----------------|
|  phone_number | number              | 01153300178               |
| password | text   | Kh12345678*             |
|  validation_code | text   | 269076 |

### patterns
|   patterns | description         
|------------:|--------------
|  phone_number | An Egyptian phone number consisting of 11 digits           
|  password | Uppercase and lowercase letters, numbers and signs, and not less than 8 letters          
|  validation_code | A real 6-digit verification number that does not expire         


### message
|   message | description         
|------------:|--------------
|  There is already a session | Looks like you already have a session          
| Missing data | Make sure to enter all required parameters
|  Invalid style | It seems that you entered an invalid data format. Look at the patterns table for the correct format          
|  Unregistered user | It appears that you are trying to log in with an account that is not registered with the system         
|  Please check the information | Incorrect password         
|  The verification code is invalid | It seems that the verification code has expired. It is invalid         
|  done | All is well         
|  Something went wrong | A problem occurred in the server         


### Note
```
Token time is only 24 hours
```

Example request:
```
Post /authentications/signin
```
Example response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
 masseage: 'done',
 token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
}
```

