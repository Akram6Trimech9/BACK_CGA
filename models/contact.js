const mongoose = require('mongoose');
 
var contactShema = new mongoose.Schema({
    message :{ 
        type:String,
        required:true
    } ,
    email:{ 
        type:String,
        required:true
    } ,
    name:{ 
        type:String,
        required:false
    } ,
    lastName:{ 
        type:String,
        required:false
    } ,
    description:{
        type:String,
        required:false
    }
})
module.exports = mongoose.model('Contacts', contactShema);