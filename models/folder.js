const mongoose = require('mongoose');


var folderSchema = new mongoose.Schema({
    titleFolder :{ 
        type:String,
        required:true
    } ,
    numberFolder :{ 
        type:Number,
        required:true
    } ,
    affairs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Affaire',
    }],
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }, 
    avocat:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status :{ 
        type: String,
        enum : ['exécuté','non exécuté'],
        default: 'non exécuté'
    }, 
    isRectified: {
        type: Boolean,
        default: false  
    },
    isExecuted: {
        type: Boolean,
        default: false  
    },
},{
  timestamps:true
})
module.exports = mongoose.model('Folder', folderSchema);