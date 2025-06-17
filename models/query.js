const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  email: { type: String, required:true},
  subject: { type: String, required:true },
  message:{type:String, min:10},
  attachment:{type:String, default:''},
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);
