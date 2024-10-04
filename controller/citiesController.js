const Cities = require('../models/cities');  

 exports.createCity = async (req, res) => {
    try {
        const { name, zip } = req.body;
        const newCity = new Cities({ name, zip });
        await newCity.save();
        res.status(201).json(newCity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.getAllCities = async (req, res) => {
    try {
        const cities = await Cities.find();
        res.status(200).json(cities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.getCityById = async (req, res) => {
    try {
        const city = await Cities.findById(req.params.id);
        if (!city) return res.status(404).json({ message: 'City not found' });
        res.status(200).json(city);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.updateCity = async (req, res) => {
    try {
        const { name, zip } = req.body;
        const city = await Cities.findByIdAndUpdate(
            req.params.id,
            { name, zip },
            { new: true, runValidators: true }
        );
        if (!city) return res.status(404).json({ message: 'City not found' });
        res.status(200).json(city);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.deleteCity = async (req, res) => {
    try {
        const city = await Cities.findByIdAndDelete(req.params.id);
        if (!city) return res.status(404).json({ message: 'City not found' });
        res.status(200).json({ message: 'City deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
