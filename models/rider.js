const mongoose = require("mongoose");

const riderSchema = new mongoose.Schema({
  name: {type:String, required:true},
  phone: {type:String, required:true},
  email: {type:String, required:true},
  password: {type:String, required:true},
  vehicle: {type:String, required:true},
  profileImage: String,
  isAvailable: { type: Boolean, default: false },
});

module.exports = mongoose.model("Rider", riderSchema);
