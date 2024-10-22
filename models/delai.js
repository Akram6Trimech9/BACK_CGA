const mongoose = require('mongoose');
const DelaiSchema = new mongoose.Schema({
    avocatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    affaireId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Affaire',
      required: true
    },
    audianceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Audiance',
        required: true
      },
    type: {
      type: String,
      enum: ['judgment', 'appel', 'cassation', 'audience', 'premiere_audience' , 'plaidoirie'],
      required: true
    },
    category: {
        type: String,
        enum: ['publication', 'plaidoirie', 'convocation', 'cassation', 'premiere_audience'],
        required: false
      },
    daysRemaining: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '24h'
    }
  });
  
  module.exports = mongoose.model('Delai', DelaiSchema);