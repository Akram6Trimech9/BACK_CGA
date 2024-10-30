const mongoose = require('mongoose');

const JustificationSchema = new mongoose.Schema({
    date: { 
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
    type: { 
        type: String,
        default: "En Attente",
        enum: [
            'Jugement Primaire',
            'Jugement Appel',
            'Jugement Prononcé',
            'Jugee',
            'Non Jugee',
            'En Attente',
            'Décision Rendue en Appel',
            'Jugement Non Désigné',
            'Décision Réduite',
            'Affaire Rejetée',
            'Affaire Acceptée',
            'Recours en Révision'
        ],  
    },
    copieJugement: { 
        type: String, 
        required: false
    },
    natureJugement: { 
        type: String, 
        enum:['presence','absence'],
        required: false
    },
    situationClient: {  
        type: String,
        enum: [
            'Actif',
            'Inactif',
            'En Procédure',
            'En Rétablissement'
        ],  
        required: false
    },
    avocatAssocie: { 
        type: String, 
        required: false
    },
    affaire:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Affaire',
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Justification', JustificationSchema);
