const Depense = require('../models/depense');
const User = require('../models/user');



exports.createDepense = async (req, res) => {
    const { adminId } = req.body;
    try {
         const existingDepense = await Depense.findOne({ adminId });
        if (existingDepense) {
            return res.status(400).json({ message: 'This admin already has a Depense.' });
        }

        const depense = new Depense({
            total: 0, // Initialize total to 0 when creating a new Depense
            adminId 
        });

        await depense.save();

        // Update User model with depense reference if needed
        if (adminId) {
            await User.findByIdAndUpdate(adminId, { depense: depense._id }, { new: true });
        }

        res.status(201).json(depense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateDepense = async (req, res) => {
    const { adminId } = req.body;
    try {
        const depense = await Depense.findOne({ adminId });
        if (!depense) {
            return res.status(404).json({ message: 'Depense not found for this admin.' });
        }


        await depense.save();
        res.status(200).json(depense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDepenseStatus = async (req, res) => {
    const { adminId } = req.params;  
    try {
        const depense = await Depense.findOne({ adminId });
        if (depense) {
            return res.status(200).json({ hasDepense: true, depenseId: depense._id });
        } else {
            return res.status(200).json({ hasDepense: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.createResource = async (req, res) => {
    const { adminId, montant, description, date } = req.body;
    try {
         const depense = await Depense.findOne({adminId: adminId});
        if (!depense) {
            return res.status(404).json({ message: 'Depense not found' });
        }

         depense.ressources.push({ montant, description, Date: date });
        depense.total += montant; // Update total
        await depense.save();

        res.status(201).json(depense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeResource = async (req, res) => {
    const { adminId, resourceId } = req.params;
    try {
        const depense = await Depense.findOne({ adminId: adminId });
        if (!depense) {
            return res.status(404).json({ message: 'Depense not found' });
        }

        const resource = depense.ressources.id(resourceId);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        depense.total -= resource.montant; 
        depense.ressources.pull(resourceId);  
        await depense.save();

        res.status(200).json(depense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


 exports.updateResource = async (req, res) => {
    const { depenseId, resourceId } = req.params;
    const { montant, description, date } = req.body;

    try {
        const depense = await Depense.findById(depenseId);
        if (!depense) {
            return res.status(404).json({ message: 'Depense not found' });
        }

        const resource = depense.ressources.id(resourceId);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Update the total by adjusting the montant
        depense.total = depense.total - resource.montant + montant;

        resource.montant = montant;
        resource.description = description;
        resource.Date = date;

        await depense.save();
        res.status(200).json(depense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.getAllResources = async (req, res) => {
    const { adminId } = req.params;
    try {
        const depense = await Depense.findOne({adminId: adminId}).populate('ressources');
        if (!depense) {
            return res.status(404).json({ message: 'Depense not found' });
        }
        res.status(200).json(depense.ressources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTotal = async (req, res) => {
    const { depenseId } = req.params;
    try {
        const depense = await Depense.findById(depenseId);
        if (!depense) {
            return res.status(404).json({ message: 'Depense not found' });
        }
        res.status(200).json({ total: depense.total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.updateTotal = async (req, res) => {
    const { depenseId, total } = req.params;
    try {
        const depense = await Depense.findById(depenseId);
        if (!depense) {
            return res.status(404).json({ message: 'Depense not found' });
        }
        depense.total = total; // Set total directly
        await depense.save();
        res.status(200).json(depense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTotalByAdmin= async (req, res) => {
    const { adminId } = req.params;
    try {
        const depense = await Depense.findOne({adminId:adminId});
        if (!depense) {
            return res.status(404).json({ message: 'Depense not found' });
        }
        res.status(200).json({ total: depense.total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
