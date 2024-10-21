const mongoose = require('mongoose');
 
var cabinetShema = new mongoose.Schema({
    name :{ 
        type:String,
        required:true
    } ,
    address:{ 
        type:String,
        required:true
    } ,
    description:{ 
        type:String,
        required:true
    } ,
    localisation:{ 
        type:String,
        required:true
    } ,
    
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sousAdmins:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})
module.exports = mongoose.model('Cabinet', cabinetShema);