const mongoose = require('mongoose');

var affaireSchema = new mongoose.Schema({
    numeroAffaire :{ 
        type: Number,
        required: true
    }, 
    natureAffaire :{ 
        type: String,
        enum : ['civil', 'pénale', 'administrative', 'commerciale'],
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
    degre:{
        type: String,
        enum : ['première_instance', 'appel', 'cassastion'],
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
