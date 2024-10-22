const mongoose = require('mongoose');
 
var procesShema = new mongoose.Schema({

    nbreTribunal :{ 
        type: Number,
        required: true
    }, 
    type :{ 
        type: String,
        enum:['plaintes','procés directe','chéque'],
        required: true
    }, 
    tribunal :{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tribinaux',
    }, 
    folder:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
    },
    client:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
 
 
    year:{
        type: String,
        required: true
    },
    inventaire: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventaire',
    }],
    file: { 
        type: String,
        required: false
    }
},{
  timestamps: true
});
module.exports = mongoose.model('Proces', procesShema);