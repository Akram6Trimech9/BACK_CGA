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
    degre:{
        type: String,
        enum : ['première_instance', 'appel', 'cour_suprême'],
        required: true
    },
    opposite: {
        type: String,
        required: true
    }, 
    aboutissement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Justification',
    }, 
    folder:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
    },
    inventaire: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventaire',
    }],
    audiances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Audiance' }] ,
    file: { 
        type: String,
        required: false
    },
    credit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Credit'
    },
},{
  timestamps: true
});

module.exports = mongoose.model('Affaire', affaireSchema);
