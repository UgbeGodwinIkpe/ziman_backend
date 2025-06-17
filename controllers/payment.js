const User = require('../models/User');
const Order=require('../models/Order')
const axios = require('axios');
// Server-side code
// This is your test secret API key.
const stripe = require("stripe")("sk_test_51IaKWrF3UDMLO7wfqQEiLyjP3VGQx60rLq5h7Zj4CZr9y1EDlS3e280vaxoot2fSsto5XMK8b022ioS5h5TCr3Jw00ZbCM4rux", {
    apiVersion: "2025-04-30.basil",
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
          callback_url: "http://localhost:5000/api/auth/users/paymentComplete"
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
        const order=await Order.findByIdAndUpdate(orderId, {payRef:response.data.data.reference}, {new:true})
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
        const order=await Order.findOneAndUpdate({payRef:response.data.data.reference}, {paid:true}, {new:true})
        console.log("Order Status: ", order)
      }
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.response.data });
    }
}



