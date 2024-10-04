const mongoose = require('mongoose');

 const documentCategories = ['juridique', 'fiscale', 'economique', 'sociale'];

 var documentSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true
    },
    category: { 
        type: String,
        required: true,
        enum: documentCategories  
    },
    description: { 
        type: String,
        required: true
    },
    file: { 
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Documents', documentSchema);
