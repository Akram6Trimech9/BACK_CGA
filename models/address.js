const mongoose = require('mongoose');
var addressSchema = new mongoose.Schema({

    city :{ 
        type:String,
        required:true
    } ,
    nom :{ 
        type:String,
        required:true
    },
    address :{ 
        type:String,
        required:true
    }
},{
  timestamps:true
})
module.exports = mongoose.model('Address', addressSchema);