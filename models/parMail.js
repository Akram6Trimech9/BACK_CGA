const mongoose = require('mongoose');
 
var parEmailSchema = new mongoose.Schema({
    email :{ 
        type:String,
        required:true
    } ,
    message:{
        type:String,
        required:true
    },
    avocat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }, 
})
module.exports = mongoose.model('parEmail', parEmailSchema);