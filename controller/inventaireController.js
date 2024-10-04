const Inventaire = require('../models/inventaire');
const asyncHandler = require('express-async-handler');
// Controller to fetch inventaires with search and pagination
const getInventaires = asyncHandler(async (req, res) => {
    const { full_name, typeInventaire, page = 1, limit = 10 } = req.query;

     let query = {};
    if (full_name) {
        query.full_name = { $regex: full_name, $options: 'i' }; // Case-insensitive search
    }
    if (typeInventaire) {
        query.typeInventaire = typeInventaire;
    }

     const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

     const inventaires = await Inventaire.find(query)
        .skip(skip)  // Skip for pagination
        .limit(pageSize)  // Limit number of items per page
 
     const totalInventaires = await Inventaire.countDocuments(query);

     res.status(200).json({
        total: totalInventaires,  // Total number of matching records
        page: pageNumber,  // Current page number
        pageSize: pageSize,  // Number of items per page
        data: inventaires,  // List of inventaires (paginated)
    });
});

const getInventaireById = asyncHandler(async (req, res) => {
    const inventaire = await Inventaire.findById(req.params.id).populate('affaires audiances');
    if (!inventaire) {
        res.status(404);
        throw new Error('Inventaire not found');
    }
    res.status(200).json(inventaire);
});

 
const createInventaire = asyncHandler(async (req, res) => {
    const { full_name, adresse, phone1, phone2 ,typeInventaire} = req.body;
  console.log(req.body)
      if (!full_name   ) {
        res.status(400);
        throw new Error('Full name, address, phone1, are required');
    }

     const inventaire = new Inventaire({
        full_name,
        adresse,
        phone1,
        phone2,  
          typeInventaire
    });

     const createdInventaire = await inventaire.save();
    if(createdInventaire){
        res.status(201).json(createdInventaire); 
    }else{ 
        res.status(500).json({message : 'errror lors creating'}); 

    }
});

 
const updateInventaire = asyncHandler(async (req, res) => {
    const { inventaireName, inventaireLastName, inventaireRole, affaires, audiances } = req.body;

    const inventaire = await Inventaire.findById(req.params.id);

    if (!inventaire) {
        res.status(404);
        throw new Error('Inventaire not found');
    }

    inventaire.inventaireName = inventaireName || inventaire.inventaireName;
    inventaire.inventaireLastName = inventaireLastName || inventaire.inventaireLastName;
    inventaire.inventaireRole = inventaireRole || inventaire.inventaireRole;
    inventaire.affaires = affaires || inventaire.affaires;
    inventaire.audiances = audiances || inventaire.audiances;

    const updatedInventaire = await inventaire.save();
    res.status(200).json(updatedInventaire);
});

 
const deleteInventaire = asyncHandler(async (req, res) => {
    const inventaire = await Inventaire.findById(req.params.id);

    if (!inventaire) {
        res.status(404);
        throw new Error('Inventaire not found');
    }

    await inventaire.remove();
    res.status(200).json({ message: 'Inventaire removed' });
});

module.exports = {
    getInventaires,
    getInventaireById,
    createInventaire,
    updateInventaire,
    deleteInventaire
};
