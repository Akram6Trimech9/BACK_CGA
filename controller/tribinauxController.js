const Tribinaux = require('../models/tribinaux');

 const createTribinaux = async (req, res) => {
    try {
        const newTribinaux = new Tribinaux(req.body);
        const savedTribinaux = await newTribinaux.save();
        res.status(201).json(savedTribinaux);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

 const getAllTribinaux = async (req, res) => {
    try {
        const tribunaux = await Tribinaux.find();
        res.status(200).json(tribunaux);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 const getTribinauxById = async (req, res) => {
    try {
        const tribunaux = await Tribinaux.findById(req.params.id);
        if (!tribunaux) {
            return res.status(404).json({ message: 'Tribinaux not found' });
        }
        res.status(200).json(tribunaux);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 const updateTribinaux = async (req, res) => {
    try {
        const updatedTribinaux = await Tribinaux.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedTribinaux) {
            return res.status(404).json({ message: 'Tribinaux not found' });
        }
        res.status(200).json(updatedTribinaux);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

 const deleteTribinaux = async (req, res) => {
    try {
        const deletedTribinaux = await Tribinaux.findByIdAndDelete(req.params.id);
        if (!deletedTribinaux) {
            return res.status(404).json({ message: 'Tribinaux not found' });
        }
        res.status(200).json({ message: 'Tribinaux deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export all controller functions
module.exports = {
    createTribinaux,
    getAllTribinaux,
    getTribinauxById,
    updateTribinaux,
    deleteTribinaux
};
