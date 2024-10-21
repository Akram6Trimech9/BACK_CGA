const mongoose = require('mongoose');
 
var tribinauxShema = new mongoose.Schema({
    nom :{ 
        type:String,
        required:true
    } ,
    type:{ 
        type:String,
        required:true
    } ,
    
})
module.exports = mongoose.model('Tribinaux', tribinauxShema);