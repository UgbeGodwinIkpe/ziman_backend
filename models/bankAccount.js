const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
    bank_name: {
      type: String,
      required: true,
    },
    account_name: { 
        type: String,
        required: true,
        unique: true
    },
    account_number: {
        type: String,
        required: true
    },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    
  });
module.exports = mongoose.model('bankAccount', bankAccountSchema);
