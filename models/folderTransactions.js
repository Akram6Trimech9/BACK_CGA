const mongoose = require('mongoose');
 
var folderTransactionSchema = new mongoose.Schema({
    from :{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    } ,
    to:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
     } ,
     folder:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
     } ,
    message :{
        type : String ,
        required : true 
    }
    
},{
    timestamps:true
  })
module.exports = mongoose.model('FolderTransaction', folderTransactionSchema);