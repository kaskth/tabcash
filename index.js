import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import messaging from './2_business_layer/messaging.js';
import authentications from './2_business_layer/authentications.js'
import transfer from "./2_business_layer/transfer.js";
import childs from "./2_business_layer/childs.js";
import deposit from "./2_business_layer/deposit.js";
import withdrawal from "./2_business_layer/withdrawal.js";

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.use('/messaging',messaging)
app.use('/authentications',authentications)
app.use('/transfer',transfer)
app.use('/transfer',deposit)
app.use('/transfer',withdrawal)
app.use('/childs',childs)

app.listen(8080,()=>{
    console.log('port: 8080')
})