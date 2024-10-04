const mongoose = require('mongoose');
 
var messageSchema = new mongoose.Schema({
    message :{ 
        type:String,
        required:true
    } ,
    user:      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }, 
      email:{
        type:String,
        required:false
      }
},{
  timestamps:true
})
module.exports = mongoose.model('Message', messageSchema);