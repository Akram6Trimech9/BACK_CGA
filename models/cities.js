const mongoose = require('mongoose');
 
var citiesShema = new mongoose.Schema({
    name :{ 
        type:String,
        required:true
    } ,
    zip:{ 
        type:String,
        required:true
    } ,
    
})
module.exports = mongoose.model('Cities', citiesShema);