const mongoose = require('mongoose');

 var fileSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    path:{
        type: String,
        required: true
    },
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GsFolder',  
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transferredTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    isRoot: {
        type: Boolean,
        default: false 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Files', fileSchema);
