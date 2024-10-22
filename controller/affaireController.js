const Affaire = require('../models/affaire');  
const Folder = require('../models/folder');    
const Justification = require('../models/justification')
const User= require('../models/user')
const Credit= require('../models/credit')

const PDFDocument = require('pdfkit');
const fs = require('fs');
const { generatePDF } = require('../services/generatePdf');
exports.createAffaire = async (req, res) => {
    try {
 
         const { 
            numeroAffaire,       
            natureAffaire,       
            opposite,            
            degre,               
            category,
             statusClient,         
            dateDemande,  
         } = req.body;
        
         const { folderId } = req.params;

         if (!numeroAffaire || !natureAffaire || !category  || !opposite || !degre || !folderId) {
            return res.status(400).json({ success: false, message: 'Missing required fields: numeroAffaire, natureAffaire, opposite, degre, or folderId.' });
        }

         const filePath = req.file ? req.file.path : null;

         const affaireData = {
            numeroAffaire,
            natureAffaire,
            opposite,
            category,
            degre,
            folder: folderId,
            file: filePath,      
        };

         if (dateDemande) affaireData.dateDemande = dateDemande;
        if (statusClient) affaireData.statusClient = statusClient;

        const newAffaire = new Affaire(affaireData);
 

        const savedAffaire = await newAffaire.save();

        const justification = new Justification({ 
            affaire :savedAffaire._id
        })
        const savedJustification = await justification.save();

        await Affaire.findByIdAndUpdate(savedAffaire._id, {
            $set: { aboutissement: savedJustification._id }
        });

 
        await Folder.findByIdAndUpdate(
            folderId,
            { $push: { affairs: savedAffaire._id } },
            { new: true }
        );

        res.status(201).json({ success: true, data: savedAffaire });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAffaireClient= async(req,res) =>{
    const { clientId} = req.params
    try {
        const folders = await Folder.find({
            client: clientId 
        });
    
       if (!folders.length) {
         return res.status(404).json({ message: 'No folders found for this client.' });
       }
   
        const affaireIds = folders.flatMap(folder => folder.affairs);
   
        const affaires = await Affaire.find({ _id: { $in: affaireIds } }).populate('audiances').populate('aboutissement').populate('inventaire')
   
   
       if (!affaires.length) {
         return res.status(404).json({ message: 'No affaires found for the folders.' });
       }
   
       return res.status(200).json(affaires);
     } catch (error) {
       return res.status(500).json({ message: 'Error fetching audiances', error });
     }
}

exports.getAffaireByAdmin = async(req,res) =>{
    const { adminId} = req.params
    try {
        const folders = await Folder.find({
         avocat: adminId 
        });
    
       if (!folders.length) {
         return res.status(404).json({ message: 'No folders found for this admin.' });
       }
   
        const affaireIds = folders.flatMap(folder => folder.affairs);
   
        const affaires = await Affaire.find({ _id: { $in: affaireIds } }).populate('aboutissement')
   
   
   
       if (!affaires.length) {
         return res.status(404).json({ message: 'No affaires found for the folders.' });
       }
   
       return res.status(200).json(affaires);
     } catch (error) {
       return res.status(500).json({ message: 'Error fetching audiances', error });
     }
}
exports.updateAffaire = async (req, res) => {
    try {
        const { affaireId } = req.params;
        const { numeroAffaire,category, natureAffaire, opposite, aboutissement, folderId, file, credit } = req.body;

        const filePath = req.file ? req.file.path : file; // Use the uploaded file path or the existing file path

        const updatedAffaire = await Affaire.findByIdAndUpdate(
            affaireId,
            { numeroAffaire, natureAffaire,category, opposite, aboutissement, folder: folderId, file: filePath, credit },
            { new: true }
        );

        const oldAffaire = await Affaire.findById(affaireId);
        if (oldAffaire.folder) {
            await Folder.findByIdAndUpdate(
                oldAffaire.folder,
                { $pull: { affairs: affaireId } }
            );
        }

        if (folderId) {
            await Folder.findByIdAndUpdate(
                folderId,
                { $addToSet: { affairs: affaireId } }
            );
        }

        res.status(200).json({ success: true, data: updatedAffaire });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get an Affaire by ID
exports.getAffaireById = async (req, res) => {
    try {
        const { affaireId } = req.params;
        const affaire = await Affaire.findById(affaireId).populate('folder').populate('inventaire').populate('audiances').populate('credit').populate('aboutissement')
        if (!affaire) {
            return res.status(404).json({ success: false, message: 'Affaire not found' });
        }
        res.status(200).json({ success: true, data: affaire });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAffaireByFolder = async (req, res) => {
    try {
        const { folderId } = req.params;
        const affaire = await Affaire.find({folder :folderId}).populate('folder').populate('inventaire').populate('audiances').populate('credit').populate('aboutissement');
        if (!affaire) {
            return res.status(404).json({ success: false, message: 'Affaire not found' });
        }
        res.status(200).json({ success: true, data: affaire });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete an Affaire
exports.deleteAffaire = async (req, res) => {
    try {
        const { affaireId } = req.params;
        
        const affaire = await Affaire.findById(affaireId);
        if (!affaire) {
            return res.status(404).json({ success: false, message: 'Affaire not found' });
        }

        if (affaire.folder) {
            await Folder.findByIdAndUpdate(
                affaire.folder,
                { $pull: { affairs: affaireId } }
            );
        }

        await Affaire.findByIdAndDelete(affaireId);

        res.status(200).json({ success: true, message: 'Affaire deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.addIntervenantToAffaire= async (req, res) => {
    const { intervenantId } = req.body;  
    const { affaireId } = req.params; 
     try {
      const affaire = await Affaire.findById(affaireId);
      
      if (!affaire) {
        return res.status(404).json({ message: 'affaire not found' });
      }
  
      if (affaire.inventaire.includes(intervenantId)) {
        return res.status(400).json({ message: 'Intervenant already added.' });
      }
  
      const updateAffaire = await Affaire.findByIdAndUpdate(
        affaireId,
        { $push: { inventaire: intervenantId } },
        { new: true }
      );
  
      return res.status(200).json(updateAffaire);
    } catch (error) {
      return res.status(500).json({ message: 'Error adding intervenant to audiance', error });
    }
  };

  exports.generatePdf = async (req, res) => {
    try {
        const { affaireId } = req.params;

        const affaire = await Affaire.findById(affaireId)
            .populate('folder')
            .populate('inventaire')
            .populate('audiances')
            .populate('credit')
            .populate('aboutissement');
 console.log(affaire,"affaire");
 
        if (!affaire) {
            return res.status(404).json({ success: false, message: 'Affaire not found' });
        }

        const client = await User.findById(affaire.folder.client);
        const credits = await Credit.findById(affaire.credit?._id);
        const pdfPath = await generatePDF(affaire, client, credits);

        // Check if the PDF file was created successfully
        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({ success: false, message: 'PDF not found at the specified path.' });
        }

        res.download(pdfPath, `${affaire.numeroAffaire}.pdf`, (err) => {
            if (err) {
                res.status(500).json({ success: false, message: 'Error downloading PDF', error: err.message });
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllAffairesByAvocat = async (req, res) => {
    const { avocatId } = req.params;
    const { clientName, folderNumber, degre, page = 1, limit = 10 } = req.query;
    try {
        const foldersQuery = { avocat: avocatId };
        if (clientName) {
             const client = await User.findOne({ lastname: clientName });
            console.log(client)
            if (client) {
                foldersQuery.client = client._id;
            }
        }

        if (folderNumber) {
            foldersQuery.numberFolder = folderNumber;
        }

        const folders = await Folder.find(foldersQuery);
        if (!folders.length) {
            return res.status(404).json({ message: 'No folders found for this avocat.' });
        }

        const affaireIds = folders.flatMap(folder => folder.affairs);

        const affairesQuery = {};
        if (degre) {
            affairesQuery.degre = degre; 
        }       


        const totalAffaires = await Affaire.countDocuments({ _id: { $in: affaireIds }, ...affairesQuery });
        console.log(totalAffaires)
       
        const affaires = await Affaire.find({ _id: { $in: affaireIds }, ...affairesQuery })
            .populate('folder')
            .populate('inventaire')
            .populate('audiances')
            .populate('credit')
            .populate('aboutissement')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        return res.status(200).json({
            total: totalAffaires,
            page: page,
            totalPages: Math.ceil(totalAffaires / limit),
            affaires,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching affaires', error });
    }
};



  