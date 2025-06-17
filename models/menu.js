const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image:{type:String, required:true},
  category:{type:String, default:"Food"},
  available: { type: Boolean, default: true },
  isTrending: { type: Boolean, default: true },
  isPopular:{ type: Boolean, default: true },
});

const menuSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  items: [menuItemSchema],
});

module.exports = mongoose.model("MenuItem", menuSchema);
