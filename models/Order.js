const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  refId:{type:String, default:''},
  pickupAddress: String,
  dropoffAddress: String,
  packageSize: { type: String, enum: ['small', 'medium', 'large'], default:"small" },
  totalPrice: Number,
  items: [{ 
    menuItem: { 
      type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' 
    },
    quantity: Number
  }],
  total: Number,
  status: { 
    type: String,
    enum: ['pending', 'accepted', 'preparing', 'ready-for-pick-up', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider' },
  isPickupRequest:{type:Boolean, default:false},
  createdAt: { type: Date, default: Date.now },
  scheduledAt:{type:Date, default:Date.now},
  paid:{type:Boolean, default:false},
  payRef:{type:String,default:''},
  paymentSettled:{type:Boolean, default:false}
}, { timestamps: true });



module.exports = mongoose.model('Order', orderSchema);
