const mongoose = require('mongoose');
 
var depenseShema = new mongoose.Schema({
    total :{ 
        type: Number,
        required:true
    } ,
    ressources:[{ 
        montant:Number,
        description : String ,
        Date : Date 
     }] ,
    adminId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
    
})
module.exports = mongoose.model('Depense', depenseShema);