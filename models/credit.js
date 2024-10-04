const mongoose = require('mongoose');

var creditSchema = new mongoose.Schema({
  totalCredit: {  
    type: Number,
    required: true
  },
  payedCredit: [{  

    part: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    method: {
      type: String,
      required: true
    },
    natureTranche:{
      type: String,
      required: true
    }

  }],
  client:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  affaire:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Affaire'
  },
  
}, {
  timestamps: true
});

module.exports = mongoose.model('Credit', creditSchema);
