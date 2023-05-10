# Child API

This service allows you to create a sub-account for your children under the age of 16, where you can add money to their sub-account via your smart wallet. You can specify the frequency of these deposits every day, week or month, depending on your desire and requirements.

Through the sub-account, your children can access the sums of money that you put in their account, and they can use it through the smart wallet and transfer it to their cash balance to use it to buy the things they want.

The system also allows you to determine the extent of control that you have over the disbursement of the sums of money deposited in the child’s sub-account, where you can set the maximum daily, weekly or monthly expenditure, and you can also define the categories in which your children can use the sums of money, such as food commodities, clothes or toys or recreational activities.

| Method | Function |
|-------:|----------|
|  Post | create   |


## Create

Create a sub-account for young children.

Post :   https://tabcash.vercel.app/childs/create

|   Parameter | Type   | Example                                   |
|------------:|--------|-------------------------------------------|
|  phone_number | number | 1000                                      |
|  first_name | text   | 01064164392                               |
|  last_name | text | Kh12345678*                               |
|  password | text | 12345678                                  |
|  age | number | Kh12345678*                               |
|  type | text | daily' or 'weekly' or 'monthly' or 'none' |
|  expense | number | 50.00                                    |
|  category | array  | ['Toys','Books']                          |


### patterns
|   patterns | description         
|------------:|--------------
|  phone_number | An Egyptian phone number consisting of 11 digits           
|  first_name | normal name          
|  last_name | normal name         
|  password | Consists of 8 letters or more         
|  age | Whole number from 10 to 16         
|  type | Choose one from daily' or 'weekly' or 'monthly' or 'none'         
|  expense | Expense according to the type chosen         
|  category | Matrix of categories see table below         


### message
|                                    message | description         
|-------------------------------------------:|--------------
|                               Please login | The token was not sent with the request, it is expired, or it is fake          
|                               Missing data | Make sure to enter all required parameters
|                              Invalid style | It seems that you entered an invalid data format. Look at the patterns table for the correct format          
|                              categories are not supported | Unknown categories have been sent to the system          
|                             The phone number has already been used | The phone number has already been used         
|                             Invalid expense | expense does not match the conditions       
|                        done | Everything is just fine         
| Something went wrong | A problem occurred in the server       

### Note
```
1- You must log in first
2- The expense must not be less than 50 and not more than 30,000
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
Post /childs/create
```
Example response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
    massage: 'done'
}
```

### categories
```
['Toys','Books','Games','Sports equipment','Arts and Crafts','Musical instruments','Science kits','Board games','Puzzles','Building sets','Dolls','Action figures','Outdoor toys','Video games','Educational toys','Pretend play','Remote control toys','Dress-up','Trains and train sets','Construction toys','Bikes','Scooters','Skateboards','Swimming gear','Outdoor play equipment','Legos','Play kitchen','Teddy bears','Stuffed animals','Food','Electronics','Home appliances','Musical equipment','Cameras','Beauty products','Jewelry','Clothing','Shoes','Furniture','Home decor','Kitchenware','Pet supplies','Stationery','Art supplies','Fitness equipment','Sports memorabilia','Collectibles','Antiques','Board games','Gardening tools','Camping gear','Tools','Travel accessories','Musical recordings','Watches']
```