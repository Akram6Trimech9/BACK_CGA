const mongoose = require('mongoose');
 
var cercleShema = new mongoose.Schema({
    nom :{ 
        type:String,
        required:true
    } ,
    type:{ 
        type:String,
        required:true
    } ,
    
})
module.exports = mongoose.model('Cercle', cercleShema);