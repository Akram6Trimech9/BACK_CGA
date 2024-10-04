const mongoose = require('mongoose');

var rdvSchema = new mongoose.Schema({
    reservationTime: {
        type: String,
        required: true
    },
    displonibilty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminAvaibility',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    avocats:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['accepted', 'refused', 'pending'],  
        default: 'pending'  
    },
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest',
    },
    rdvBy:{
        type: String,
        enum: ['guest', 'client'],  
        default: 'client'  
    }
},{
    timestamps:true
});

module.exports = mongoose.model('Rdv', rdvSchema);