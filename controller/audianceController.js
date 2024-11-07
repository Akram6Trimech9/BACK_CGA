const Audiance = require('../models/audiance');
const Affaire = require('../models/affaire');
const Address = require('../models/address');
const Folder = require('../models/folder')
const Delai = require('../models/delai')

exports.addAudiance = async (req, res) => {
  try {
    const { dateAudiance, description, tribunalId, numero  , type} = req.body;
    const { adminId, affaireId } = req.params;

    if (!dateAudiance || !description) {
      return res.status(400).json({ message: 'Date and description are required.' });
    }

    const files = req.files ? req.files.map(file => file.path) : [];

     const existingAffaire = await Affaire.findById(affaireId);
    if (!existingAffaire) {
      return res.status(404).json({ message: 'Affaire not found' });
    }

    const newAudiance = new Audiance({
      dateAudiance,
      description,
      affaires: affaireId,
      type,
      numero,
      tribunal: tribunalId,
      files,
    });

    const savedAudiance = await newAudiance.save();
    if (savedAudiance) {
      const updatedAffaire = await Affaire.findByIdAndUpdate(
        affaireId,
        { $push: { audiances: savedAudiance._id } },
        { new: true }
      );

      if (updatedAffaire) {
        return res.status(201).json(savedAudiance); // Optionally, return updatedAffaire
      }
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error creating audiance', error });
  }
};

exports.getAudianceByAdmin = async (req, res) => {
  const { adminId } = req.params;  
  try {
     const folders = await Folder.find({
      avocat: adminId 
     });
 
    if (!folders.length) {
      return res.status(404).json({ message: 'No folders found for this admin.' });
    }

     const affaireIds = folders.flatMap(folder => folder.affairs);

     const affaires = await Affaire.find({ _id: { $in: affaireIds } }).populate('audiances');



    if (!affaires.length) {
      return res.status(404).json({ message: 'No affaires found for the folders.' });
    }

    console.log(affaires)

     const audianceIds = affaires.flatMap(affaire => affaire.audiances);

     const audiances = await Audiance.find({ _id: { $in: audianceIds } })
      .populate('affaires')
      .populate('tribunal')
      .populate('delegation')
      .populate('city')
      .populate('inventaires');

    return res.status(200).json(audiances);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching audiances', error });
  }
};

exports.getAudiancesByAffaire= async (req, res) => {
  const {affaireId} = req.params
  try {
    const audiances = await Audiance.find({affaires:affaireId})
      .populate('affaires')
      .populate('tribunal')
      .populate('inventaires');
    return res.status(200).json(audiances);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching audiances', error });
  }
};

 exports.getAudiances = async (req, res) => {
  try {
    const audiances = await Audiance.find()
      .populate('affaires')
      .populate('tribunal')
      .populate('delegation')
      .populate('city')
      .populate('inventaires');
    return res.status(200).json(audiances);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching audiances', error });
  }
};

 exports.getAudianceById = async (req, res) => {
  try {
    const audiance = await Audiance.findById(req.params.id)
      .populate('affaires')
      .populate('address')
      .populate('inventaires');
    
    if (!audiance) {
      return res.status(404).json({ message: 'Audiance not found' });
    }

    return res.status(200).json(audiance);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching audiance', error });
  }
};
exports.updateAudiance = async (req, res) => {
  try {
    const {
      dateAudiance,
      description,
      numero,
      tribunalId,
      type,
      files
    } = req.body;
 
    let updatedAudiance = await Audiance.findById(req.params.id);
    if (!updatedAudiance) {
      return res.status(404).json({ message: 'Audiance not found' });
    }

    if (typeof dateAudiance !== 'undefined') updatedAudiance.dateAudiance = dateAudiance;
    if (typeof description !== 'undefined') updatedAudiance.description = description;
    if (typeof type !== 'undefined') updatedAudiance.type = type;
    if (typeof numero !== 'undefined') updatedAudiance.numero = numero;
    if (typeof tribunalId !== 'undefined') updatedAudiance.tribunal = tribunalId;

    if (typeof files !== 'undefined') updatedAudiance.files = Array.isArray(files) ? files : [files];


    await updatedAudiance.save();
    const populatedAudiance = await Audiance.findById(updatedAudiance._id)
      .populate('tribunal'); 
    return res.status(200).json(populatedAudiance);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating audiance', error });
  }
};


 exports.deleteAudiance = async (req, res) => {
  try {
    const audiance = await Audiance.findByIdAndDelete(req.params.id);




    if (!audiance) {
      return res.status(404).json({ message: 'Audiance not found' });
    }
    await Delai.deleteMany({ audianceId: audiance._id });

     return res.status(200).json({ message: 'Audiance deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting audiance', error });
  }
};

exports.addIntervenantToAudiance = async (req, res) => {
  const { intervenantId } = req.body;  
  const { audianceId } = req.params; 
   try {
    const audiance = await Audiance.findById(audianceId);
    
    if (!audiance) {
      return res.status(404).json({ message: 'Audiance not found' });
    }

    if (audiance.inventaires.includes(intervenantId)) {
      return res.status(400).json({ message: 'Intervenant already added.' });
    }

    const updatedAudiance = await Audiance.findByIdAndUpdate(
      audianceId,
      { $push: { inventaires: intervenantId } },
      { new: true }
    );

    return res.status(200).json(updatedAudiance);
  } catch (error) {
    return res.status(500).json({ message: 'Error adding intervenant to audiance', error });
  }
};
