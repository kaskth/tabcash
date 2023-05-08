import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import checkArrayObjectsProducts from "../../4_shared_utilities_layer/checkArrayObjectsProducts.js";
import {checkForAOrder, createOrder, readOrderStatus} from "../../6_data_layer/orders.js";
import {readAllApplicationByWalletPhoneNumber, readIdByPhoneNumberAndName} from "../../6_data_layer/applications.js";
import {createAddress} from "../../6_data_layer/addresses.js";
import {createProduct} from "../../6_data_layer/products.js";
dotenv.config()


const app = express.Router()




app.post('/create',async (req,res)=>{

    // check sission
    const token = req.headers.authorization
    let user ;

    try {
        user = await jwt.verify(token,process.env.oauth2_secret)
    }catch (e) {
        return res.status(500).json({message:'token error'})
    }

    // check data
    const customer_id = req.body.customer_id
    const description = req.body.description
    const categories = req.body.categories
    const shipping = req.body.shipping || 0.00
    const tax = req.body.tax || 0.00
    const success = req.body.success
    const fail = req.body.fail
    const address_phone_number = req.body.address.phone_number
    const address_governorate = req.body.address.governorate
    const address_region = req.body.address.region
    const address_street = req.body.address.street
    const address_building = req.body.address.building
    const address_other = req.body.address.other
    const products = req.body.products

    if (
        !customer_id||
        !description||
        !categories||
        !shipping||
        !tax||
        !success||
        !fail||
        !address_phone_number||
        !address_governorate||
        !address_region||
        !address_street||
        !address_building||
        !address_other||
        !products
    ) return res.status(500).json({message: "Missing data"})

    // check pattern
    const customer_id_regex = /^[0-9a-zA-Z]{1,45}$/.test(customer_id)
    const description_regex = /^[0-9a-zA-Z]{1,255}$/.test(description)
    const categories_regex = Array.isArray(categories)
    const shipping_regex = /^\d+(\.\d{1,2})?$/.test(shipping)
    const tax_regex = /^\d+(\.\d{1,2})?$/.test(tax)
    const success_regex = /^https:\/\/[^\s/$.?#].[^\s]*$/.test(success)
    const fail_regex = /^https:\/\/[^\s/$.?#].[^\s]*$/.test(fail)
    const address_phone_number_regex = /^[0-9a-zA-Z]{1,45}$/.test(address_phone_number)
    const address_governorate_regex = /^[0-9a-zA-Z]{1,60}$/.test(address_governorate)
    const address_region_regex = /^[0-9a-zA-Z]{1,60}$/.test(address_region)
    const address_street_regex = /^[0-9a-zA-Z]{1,60}$/.test(address_street)
    const address_building_regex = /^[0-9a-zA-Z]{1,60}$/.test(address_building)
    const address_other_regex = /^[0-9a-zA-Z]{1,255}$/.test(address_other)
    const products_regex = Array.isArray(products)

    if (
        !customer_id_regex||
        !description_regex||
        !categories_regex||
        !shipping_regex||
        !tax_regex||
        !success_regex||
        !fail_regex||
        !address_phone_number_regex||
        !address_governorate_regex||
        !address_region_regex||
        !address_street_regex||
        !address_building_regex||
        !address_other_regex||
        !products_regex
    ) return res.status(500).json({message:"Data pattern error"})


    try {
        // Check data categories
        console.log(0)
        const all_category = ['Clothes and Fashion', 'Electronics', 'Furniture Home and Decoration', 'Beauty and Personal Care', 'Household Tools and Equipment', 'Games and Electronic Games', 'Books and Publications', 'Sports and Fitness', 'Jewelry and Watches', 'Food and Drinks', 'Health and Wellness', 'Games and Hobbies', 'Travel and Tourism', 'Pets and Their Supplies', 'Gifts and Special Occasions']

        const isSame = categories.every(value => all_category.includes(value))

        if (!isSame) return res.status(500).json({message:'categories are not supported'})
        console.log(1)
        // Check data governorate
        const all_governorate= ['Alexandria','Aswan','Asyut','Beheira','Beni Suef','Cairo','Dakahlia','Damietta','Faiyum','Gharbia','Giza','Ismailia','Kafr El Sheikh','Luxor','Matrouh','Minya','Monufia','New Valley','North Sinai','Port Said','Qalyubia','Qena','Red Sea','Sharqia','Sohag','South Sinai','Suez']

        if (!all_governorate.includes(address_governorate)) return res.status(500).json({message:'governorate are not supported'})
        console.log(2)
        // Check data products
        if (!await checkArrayObjectsProducts(products))
            return res.status(500).json({message:'Error in product information'})
        console.log(3)
        // total price
        let total_price=0;
        for (var x=0 ; x<products.length;x++){
            total_price += products[x].price * products[x].quantity
        }

        total_price = total_price + shipping + tax
        console.log(total_price)
        // create order
        const order = await createOrder({
            applications_id: await readIdByPhoneNumberAndName(user.wallet,user.name),
            wallet : user.wallet,
            customer_id,
            company_name: user.name,
            description,
            categories,
            shipping,
            tax,
            total_price,
            success,
            fail
        })

        const address =  await createAddress({
            orders_id: order.insertId,
            phone_number: address_phone_number,
            governorate: address_governorate,
            region: address_region,
            street: address_street,
            building: address_street,
            other: address_other
        })

        for (var y = 0;y<products.length;y++){
            await createProduct({
                orders_id: order.insertId,
                name: products[y].name,
                description: products[y].description,
                price: products[y].price,
                quantity: products[y].quantity,
                link: products[y].link
            })
        }

        // send
        res.json({
            order_id: order.insertId,
            status: true,
            message: "The order was created successfully"
        })
    }catch (e) {
        return res.status(500).json({message: "Something went wrong"})
    }

})



app.get('/payment-verification',async (req,res)=>{

    // check sission
    const token = req.headers.authorization
    let user ;

    try {
        user = await jwt.verify(token,process.env.oauth2_secret)
    }catch (e) {
        return res.status(500).json({message:'token error'})
    }
    // check data
    const order_id = req.query.order_id

    if (!order_id) return res.status(500).json({message:'Missing data'})

    // check pattern
    const order_id_regex =  /^[1-9]\d*$/.test(order_id)
    if (!order_id_regex)
        return res.status(500).json({message:"Data pattern error"})

    try {
        // check order
        if (await checkForAOrder(order_id,user.wallet))
            return res.status(500).json({message:"Unknown order number"})
        // send
        res.json({
            status: await readOrderStatus(order_id)
        })
    }catch (e) {
        return res.status(500).send({message: "Something went wrong"})
    }

})







export default app
