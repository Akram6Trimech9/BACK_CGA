const mongoose = require('mongoose');


var audianceSchema = new mongoose.Schema({
    numero:{
        type:Number,
        required:true
    },
    dateAudiance :{ 
        type:Date,
        required:true
    } ,
    description :{ 
        type:String,
        required:true
    } ,

    inventaires :[{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventaire',
    }] ,
    affaires: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Affaire',
    }, 
  
    tribunal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tribinaux',
    }, 
    type: {
        type: String,
        enum: ['Première audience', 'Audience préparatoire', 'Plaidoirie'],
        required: true
    },
 
    files: [{ 
        type: String,
        required: false
    }]
},{
  timestamps:true
})
module.exports = mongoose.model('Audiance', audianceSchema);