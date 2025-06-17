const mongoose = require('mongoose');



const adminSchema = new mongoose.Schema({
  username: {type:String, default:"ziman"},
  email: { type: String, default:"admin@ziman.com" },
  password: {type: String, default:'ziman'},
  role: { type: String, enum: ['staff', 'rider', 'admin'], default: 'admin' },
});

module.exports = mongoose.model('Admin', adminSchema);
