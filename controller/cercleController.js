const Cercle = require('../models/cercles');  

 exports.createCercle = async (req, res) => {
    try {
        console.log(req.body)
        const { nom, type } = req.body;
        const newCercle = new Cercle({ nom, type });
        await newCercle.save();
        res.status(201).json(newCercle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.getAllCercles = async (req, res) => {
    try {
        const cercles = await Cercle.find();
        res.status(200).json(cercles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.getCercleById = async (req, res) => {
    try {
        const cercle = await Cercle.findById(req.params.id);
        if (!cercle) return res.status(404).json({ message: 'Cercle not found' });
        res.status(200).json(cercle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.updateCercle = async (req, res) => {
    try {
        const { nom, type } = req.body;
        const cercle = await Cercle.findByIdAndUpdate(
            req.params.id,
            { nom, type },
            { new: true, runValidators: true }
        );
        if (!cercle) return res.status(404).json({ message: 'Cercle not found' });
        res.status(200).json(cercle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.deleteCercle = async (req, res) => {
    try {
        const cercle = await Cercle.findByIdAndDelete(req.params.id);
        if (!cercle) return res.status(404).json({ message: 'Cercle not found' });
        res.status(200).json({ message: 'Cercle deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
