# Messaging API

The Messaging API is an application programming interface that allows a Smart Wallet application to send and receive short text messages (SMS), Internet text messages (MMS), instant messages (IM), voice messages, video, images, and other files to and from mobile numbers. This interface is used to enable communication between the application and users and allow them to manage their accounts and carry out financial operations and transactions by means of SMS and other means. The Messaging API works independently of the operating system or mobile device being used, and allows developers to easily add text messaging functionality to smart wallet applications, through the use of programming and development of the interface.

| Method | Function |
|-------:|--------|
|    Post | sms-verification |




## sms-verification

Send an SMS with the verification code

Post :  https://tabcash.vercel.app/messaging/sms-verification


|   Parameter | Type         | Example          |
|------------:|--------------|------------------|
|  phone_number | number          | 01153300178      |


Example request:
```
Post /messaging/sms-verification
```
Example response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
 Verification message has been sent successfully
}
```



