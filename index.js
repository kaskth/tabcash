import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import messaging from './2_business_layer/messaging.js';
import authentications from './2_business_layer/authentications.js'
import transfer from "./2_business_layer/transfer.js";
import childs from "./2_business_layer/childs.js";
import deposit from "./2_business_layer/deposit.js";
import withdrawal from "./2_business_layer/withdrawal.js";
import applications from "./2_business_layer/payment gateway/applications.js";
import oauth2 from "./2_business_layer/payment gateway/oauth2.js";
import orders from "./2_business_layer/payment gateway/orders.js";

const app = express()

app.use(cors({
    origin: [
        'http://localhost:8080',
        'http://localhost:8081',
        'http://localhost:8082',
        'https://tabcash-18f8b.web.app',
        '*'
    ]
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use('/messaging',messaging)
app.use('/authentications',authentications)
app.use('/transactions',transfer)
app.use('/transactions',deposit)
app.use('/transactions',withdrawal)
app.use('/childs',childs)
app.use('/gateway/application',applications)
app.use('/gateway/oauth2',oauth2)
app.use('/gateway/orders',orders)

app.listen(8080,()=>{
    console.log('port: 8080')
})