const mongoose = require('mongoose');
 
var delegationSchema = new mongoose.Schema({
    nom :{ 
        type:String,
        required:true
    } ,
    type:{ 
        type:String,
        required:false
    } ,
    
})
module.exports = mongoose.model('Delegation', delegationSchema);