const mongoose = require('mongoose');

const inventaireSchema = new mongoose.Schema({
  full_name: { 
    type: String, 
    required: true 
  },
  adresse: { 
    type: String, 
    required: true 
  },
  phone1: { 
    type: String, 
    required: true 
  },
  phone2: { 
    type: String, 
    required: false 
  },
 
  typeInventaire:{
    type:String,
    enum: [
      'expert', 
      'huissiers_justices', 
      'huissiers_notaires', 
      'interpreters', 
      'liquidateursnotairesfiduciaires', 
      'medecinslegistes', 
      'medecinsdegatsphysiques',
      'judiciairesfaillite'
    ],
    required: true 
  },
 
  isShown:{
   type:Boolean , 
   required:true , 
   default:false
  },
  affaires: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Affaire',
  }],
  audiances: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Audiance',
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Inventaire', inventaireSchema);
