const Delai = require('../models/delai');

 exports.createDelai = async (req, res) => {
  try {
    const { avocatId, affaireId, audianceId, type, category, daysRemaining } = req.body;
    const newDelai = new Delai({
      avocatId,
      affaireId,
      audianceId,
      type,
      category,
      daysRemaining
    });
    const savedDelai = await newDelai.save();
    res.status(201).json(savedDelai);
  } catch (error) {
    res.status(500).json({ error: 'Error creating new Delai', details: error });
  }
};

 exports.getAllDelais = async (req, res) => {
  try {
    const delais = await Delai.find().populate('avocatId affaireId audianceId');
    res.status(200).json(delais);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Delais', details: error });
  }
};

// Get a single Delai by ID
exports.getDelaiById = async (req, res) => {
  try {
    const delai = await Delai.findById(req.params.id).populate('avocatId affaireId audianceId  clientId');
    if (!delai) {
      return res.status(404).json({ error: 'Delai not found' });
    }
    res.status(200).json(delai);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Delai', details: error });
  }
};

 exports.updateDelai = async (req, res) => {
  try {
    const { avocatId, affaireId, audianceId, type, category, daysRemaining } = req.body;
    const updatedDelai = await Delai.findByIdAndUpdate(
      req.params.id,
      { avocatId, affaireId, audianceId, type, category, daysRemaining },
      { new: true }
    ).populate('avocatId affaireId audianceId');

    if (!updatedDelai) {
      return res.status(404).json({ error: 'Delai not found' });
    }
    res.status(200).json(updatedDelai);
  } catch (error) {
    res.status(500).json({ error: 'Error updating Delai', details: error });
  }
};

 exports.deleteDelai = async (req, res) => {
  try {
    const deletedDelai = await Delai.findByIdAndDelete(req.params.id);
    if (!deletedDelai) {
      return res.status(404).json({ error: 'Delai not found' });
    }
    res.status(200).json({ message: 'Delai deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Delai', details: error });
  }
};

 exports.getByAdmin = async (req, res) => {
  try {
     const { avocatId, affaireId, audianceId, type, category } = req.query;
    
    const filter = {};
    if (avocatId) filter.avocatId = avocatId;
    if (affaireId) filter.affaireId = affaireId;
    if (audianceId) filter.audianceId = audianceId;
    if (type) filter.type = type;
    if (category) filter.category = category;

    const delais = await Delai.find(filter).populate('avocatId affaireId audianceId clientId ');
    res.status(200).json(delais);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Delais for Admin', details: error });
  }
};
 exports.getByAvocatId = async (req, res) => {
  try {
    const { avocatId } = req.params;

     const delais = await Delai.find({ avocatId }).populate('avocatId affaireId audianceId clientId');
    
    if (!delais || delais.length === 0) {
      return res.status(404).json({ error: 'No Delais found for this Avocat' });
    }

    res.status(200).json(delais);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Delais for this Avocat', details: error });
  }
};
