const mongoose = require('mongoose');
const paymentMethodSchema = new mongoose.Schema({
  methodType:{type:String, default:"Card"},
  cardHolder: String,
  cardNumber: String,
  expiryDate:String,
  cvv: String,
});


const userSchema = new mongoose.Schema({
  username: String,
  fullName:String,
  email: { type: String, unique: true },
  password: {type: String, default:null},
  address:String,
  role: { type: String, enum: ['customer', 'delivery', 'admin'], default: 'customer' },
  phoneNumber:{type: String, default:null},
  paymentMethod: [paymentMethodSchema],
  refid: String,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
