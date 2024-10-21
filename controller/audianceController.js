const Audiance = require('../models/audiance');
const Affaire = require('../models/affaire');
const Address = require('../models/address');
const Folder = require('../models/folder')
 
exports.addAudiance = async (req, res) => {
  try {
    const { dateAudiance, description, cercleId, numero  , type} = req.body;
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
      cercle: cercleId,
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
      .populate('cercle')
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
      .populate('cercle')
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
      .populate('cercle')
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
    const { dateAudiance, description, inventaires, affairesData, addressData,type, file } = req.body;

    let updatedAudiance = await Audiance.findById(req.params.id);
    if (!updatedAudiance) {
      return res.status(404).json({ message: 'Audiance not found' });
    }

     updatedAudiance.dateAudiance = dateAudiance || updatedAudiance.dateAudiance;
    updatedAudiance.description = description || updatedAudiance.description;
    updatedAudiance.type = type || updatedAudiance.type;

    updatedAudiance.inventaires = inventaires || updatedAudiance.inventaires;
    updatedAudiance.file = file || updatedAudiance.file;

     if (affairesData) {
      let affaire = await Affaire.findById(affairesData._id);
      if (affaire) {
        affaire.numeroAffaire = affairesData.numeroAffaire;
        affaire.natureAffaire = affairesData.natureAffaire;
        affaire.opposite = affairesData.opposite;

        affaire.aboutissement = affairesData.aboutissement;
        await affaire.save();
        updatedAudiance.affaires = affaire._id;
      }
    }

     if (addressData) {
      let address = await Address.findById(addressData._id);
      if (address) {
        address.city = addressData.city;
        address.nom = addressData.nom;
        address.address = addressData.address;
        await address.save();
        updatedAudiance.address = address._id;
      }
    }

    await updatedAudiance.save();
    return res.status(200).json(updatedAudiance);
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
