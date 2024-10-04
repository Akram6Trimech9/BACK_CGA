const mongoose = require('mongoose');
 
var adminAvaibilitySchema = new mongoose.Schema({
    date :{ 
        type:Date,
        required:true
    } ,
    startTime:{ 
        type:String,
        required:true
    } ,
    endTime:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:false
    },
    admin:   {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
})
module.exports = mongoose.model('AdminAvaibility', adminAvaibilitySchema);