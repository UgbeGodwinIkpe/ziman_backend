const User = require('../models/User');
const Order=require('../models/Order');
const PickupPackage=require('../models/pickupPackage');
const axios = require('axios');
const { pickupPackage } = require('./orderController');
require('dotenv').config();

STRIPE_KEY=process.env.STRIPE_KEY
STRIPE_API_VERSION=process.env.STRIPE_API_VERSION
const stripe = require("stripe")(STRIPE_KEY, {
    apiVersion: STRIPE_API_VERSION,
  });

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;


// payment method settup
exports.setUpPaymentMethod =async(req, res, next)=>{
   try {
    const  {cardNumber, cardHolderName, cvv, expiryDate}=req.body
    let userId= req.user._id.toString();
    // console.log(req.body, userId)
    const user = await User.findById(userId);
    if(user.fullName != cardHolderName){
        // console.log("Card holder name not match!")
        // console.log(user.fullName, cardHolderName)
        return res.status(400).json({ message: 'Card holder name does not match!' });
    }
    user.paymentMethod = {cardHolder:user.fullName, cardNumber:cardNumber, cvv:cvv, expiryDate:expiryDate};
    await user.save();
    console.log({"user":user.paymentMethod[0]})
    res.json(user);
   } catch (error) {
    console.log(error)
    res.status(500).json({ message: `${error.message}`});
    
   }
}

// Create paystack payment
exports.CreatePayment= async (req, res) => {

    const { email, amount, orderId } = req.body
    console.log({"Pay Body:":req.body})
    console.log(req.user)
  
    try {
      //http://localhost:5000/api/auth/users/paymentComplete?trxref=oj8d87v7ue&reference=oj8d87v7ue
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email,
          amount: amount * 100, // Convert to kobo
          callback_url: "https://ziman-backend.onrender.com/api/auth/users/paymentComplete"
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log({response:response.data.data})
      if(response.data.data?.reference){
        //update order
        var order=await Order.findByIdAndUpdate(orderId, {payRef:response.data.data.reference}, {new:true})
        if(order.length<=0){
          //update pickup order
          order=await PickupPackage.findByIdAndUpdate(orderId, {payRef:response.data.data.reference}, {new:true})
    
        }
        console.log(order)
      }
      res.json(response.data);
    } catch (error) {
      console.error('Paystack error:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
};

exports.VerifyPayment= async (req, res) => {
    const reference = req.params.reference || req.query.reference;
  
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          },
        }
      );
      console.log(response.data)
      if(response.data.data?.status=='success'){
        //update order
        var order=await Order.findOneAndUpdate({payRef:response.data.data.reference}, {paid:true}, {new:true})
        if(order.length<=0){
          //update pickup order
          order=await PickupPackage.findByIdAndUpdate({payRef:response.data.data.reference}, {paid:true}, {new:true})
    
        }
        console.log(order)

        console.log("Order Status: ", order)

        // send response to user
        const html = `
          <!Doctype html>
          <html lang='en'>
            <head>
              <title>Payment Succuccfulled</title>
              <meta
                content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
                name="viewport"
              >
            </head>
            <body style="font-family: Arial; padding: 5px; justify-content:center">
              <div style="background:green; color:white; margin: 10px auto 0px auto; padding:20px 20px 40px 20px; width:fit-content; text-align:center;">
                <h1>ziman</h1><hr>
                <h2>Payment Successful</h2>
                <h4>Your payment has been confirmed: <del>N</del>${response.data.data.amount/100}</h4>
                <p>Thank you for trusting ziman</p><br>
                <a href="https://ziman.com.ng" style="background:white; color:green; padding:10px; text-decoration:none;">Return Back to App</a>
              </div>

              
            </body>
          </html>
        `;

        return res.send(html);
      }
      
    res.json(response.data);
      /*
      Response Data:
      {
        "status": true,
        "message": "Verification successful",
        "data": {
          "id": 5077546449,
          "domain": "test",
          "status": "success",
          "reference": "rehoxli38k",
          "receipt_number": null,
          "amount": 5390000,
          "message": null,
          "gateway_response": "Successful",
          "paid_at": "2025-06-21T21:11:42.000Z",
          "created_at": "2025-06-21T21:09:03.000Z",
          "channel": "card",
          "currency": "NGN",
          "ip_address": "102.91.77.204",
          "metadata": "",
          "log": {
            "start_time": 1750540295,
            "time_spent": 7,
            "attempts": 1,
            "errors": 0,
            "success": true,
            "mobile": false,
            "input": [],
            "history": [
              {
                "type": "action",
                "message": "Attempted to pay with card",
                "time": 6
              },
              {
                "type": "success",
                "message": "Successfully paid with card",
                "time": 7
              }
            ]
          },
          "fees": 90850,
          "fees_split": null,
          "authorization": {
            "authorization_code": "AUTH_v7wpmqo2bv",
            "bin": "408408",
            "last4": "4081",
            "exp_month": "12",
            "exp_year": "2030",
            "channel": "card",
            "card_type": "visa ",
            "bank": "TEST BANK",
            "country_code": "NG",
            "brand": "visa",
            "reusable": true,
            "signature": "SIG_KS81veMWqUZUujxG59bg",
            "account_name": null
          },
          "customer": {
            "id": 283041629,
            "first_name": null,
            "last_name": null,
            "email": "cidus@gmail.com",
            "customer_code": "CUS_ht8obqzstgjmhzw",
            "phone": null,
            "metadata": null,
            "risk_action": "default",
            "international_format_phone": null
          },
          "plan": null,
          "split": {

          },
          "order_id": null,
          "paidAt": "2025-06-21T21:11:42.000Z",
          "createdAt": "2025-06-21T21:09:03.000Z",
          "requested_amount": 5390000,
          "pos_transaction_data": null,
          "source": null,
          "fees_breakdown": null,
          "connect": null,
          "transaction_date": "2025-06-21T21:09:03.000Z",
          "plan_object": {

          },
          "subaccount": {

          }
        }
      }
      */
    } catch (error) {
      res.status(500).json({ error: error.response.data });
    }
}



