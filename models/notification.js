const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  users: { type: String, enum: ['Restaurant', 'Public', 'Both'], default:"Both" },
  title: { type: String, required:true },
  message:{type:String, minlength:10},
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
