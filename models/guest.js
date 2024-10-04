const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  number: {
    type: String,
    required: true
  },
  rdv: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rdv',
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Guest', guestSchema);
