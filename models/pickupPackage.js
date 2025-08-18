const mongoose = require('mongoose');

const pickupPackageSchema = new mongoose.Schema({
  userId: { type: String },
  username:{type:String},
  phoneNumber:{type:String},
  pickupAddress: String,
  dropoffAddress: String, 
  packageSize: { type: String, enum: ['Small', 'Medium', 'Large'], default:"Small" },
  packageWeight:{type:String},
  package_desc:{type:String, default:""},
  pickDateTime:{type:Date, default:Date.now},
  amount: Number,
  status: { 
    type: String,
    enum: ['pending', 'accepted', 'preparing', 'ready-for-pick-up', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider' },
  isPickupRequest:{type:Boolean, default:true},
  payRef:{type:String,default:''},
  createdAt: { type: Date, default: Date.now },
  paid:{type:Boolean, default:false},
}, { timestamps: true });



module.exports = mongoose.model('PickupPackage', pickupPackageSchema);
