const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
});

const restaurantSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: { 
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone:{
        type:String
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default:4
    },
    featured: {
      type: Boolean,
      default: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: false,
      },
      coordinates: {
        type: [Number],
        required: false,
      },
    },
    address: {
      type: String,
    },
    menu: [menuItemSchema],
    images: [String],
    menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
    category: { type: String, enum: ['Food', 'Beauty', 'Electronic', 'Grocceries', 'Beverages', 'Dessert'], required: true },
    createdAt:{type:Date, default:Date.now}

  });
  
restaurantSchema.index({ location: '2dsphere' });
  
module.exports = mongoose.model('Restaurant', restaurantSchema);
  

// const restaurantSchema = new mongoose.Schema({
//   name: String,
//   address: String,
//   email:String,
//   phone:String,
//   password:String,
//   image: String,
//   menu: [menuItemSchema],
//   category: { type: String, enum: ['Food', 'Beauty', 'Electronic', 'Grocceries', 'Beverages', 'dessert'], required: true },

// });

