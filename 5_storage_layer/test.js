// import axios from "axios";
//
//
// try {
//     const res = await axios.post('http://localhost:8080/gateway/orders/create',{
//         customer_id: "aaaasss",
//         description: "sssssssss",
//         categories: ["Electronics"],
//         shipping: 10.00,
//         tax: 5.00,
//         success: 'https://mail.google.com/',
//         fail: "https://mail.google.com/",
//         address: {
//             phone_number: "asdassdasd",
//             governorate: "Alexandria",
//             region: "dasdsada",
//             street: "sasfsfsdfd",
//             building: "dfddddd",
//             other: "sadddddddd"
//         },
//         products:[
//             {name:"asadsa",description:"asda",price:10.00,quantity:3,link:"https://mail.google.com/"},
//             {name:"asadsa",description:"asda",price:10.00,quantity:3,link:"https://mail.google.com/"}
//         ]
//     },{
//         headers:{
//             authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXQiOiIwMTE1MzMwMDE3OCIsIm5hbWUiOiJrYXNrdGgiLCJpYXQiOjE2ODM1MjEyNzQsImV4cCI6MTY4MzUzMjA3NH0.aAsNKanx4MTvvdsUrITPubIevfMAd6EmB2uhp7Diyoc'
//         }
//     })
//     console.log(res.data.insertId)
// }catch (e) {
//     console.log(e.response.data.message)
// }


import generateCreditCard from "../4_shared_utilities_layer/generateCreditCard.js";

console.log(await generateCreditCard())