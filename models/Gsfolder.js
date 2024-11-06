const mongoose = require('mongoose');

 var gsFolderSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentFolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GsFolder', 
        default: null
    },
    transferredTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Files',
    }],
    subFolders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GsFolder' 
    }],
    isRoot: {
        type: Boolean,
        default: false  
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('GsFolder', gsFolderSchema);
