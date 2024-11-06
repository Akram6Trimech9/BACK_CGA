const mongoose = require('mongoose');

var affaireSchema = new mongoose.Schema({
    numeroAffaire :{ 
        type: Number,
        required: true
    }, 
    category :{ 
        type: String,
        enum : ['civil', 'pénale', 'administrative',  'commerciale' , 'immobilère', 'militaire' ],
        required: true
    },
    natureAffaire : {
        type: String,
        enum : ['mise à jour', 'enregistrement facultatif','incartade','criminelle','enfants-incartade','enfants délinquants'],
        required: true    
    },
    statusClient :{ 
        type: String,
        enum : ['plaignant', 'accuse'],
        required: false
    },

    dateDemande :{ 
        type: Date,
        required: false
    },
    dateInformation: { 
        type: Date,
        required: false
    },
    dateConvocation: { 
        type: Date,
        required: false
    },
    degre:{
        type: String,
        enum : ['première_instance', 'appel', 'cassation','demande de réexamen', 'oppositionPremier' ,'oppositionAppel'],
        required: true
    },
    opposite: {
        type: String,
        required: true
    }, 
    avocatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }, 
    aboutissement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Justification',
    }, 
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
    },
    inventaire: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    audiances: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Audiance'
    }],
    credit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Credit'
    },
 
    file: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Affaire', affaireSchema);
