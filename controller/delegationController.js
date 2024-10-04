const Delegation = require('../models/delegation')

 exports.createDelegation = async (req, res) => {
    try {
        const { nom, type } = req.body;
        const newDelegation = new Delegation({ nom, type });
        await newDelegation.save();
        res.status(201).json(newDelegation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.getAllDelegations = async (req, res) => {
    try {
        const delegations = await Delegation.find();
        res.status(200).json(delegations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.getDelegationById = async (req, res) => {
    try {
        const delegation = await Delegation.findById(req.params.id);
        if (!delegation) return res.status(404).json({ message: 'Delegation not found' });
        res.status(200).json(delegation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.updateDelegation = async (req, res) => {
    try {
        const { nom, type } = req.body;
        const delegation = await Delegation.findByIdAndUpdate(
            req.params.id,
            { nom, type },
            { new: true, runValidators: true }
        );
        if (!delegation) return res.status(404).json({ message: 'Delegation not found' });
        res.status(200).json(delegation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.deleteDelegation = async (req, res) => {
    try {
        const delegation = await Delegation.findByIdAndDelete(req.params.id);
        if (!delegation) return res.status(404).json({ message: 'Delegation not found' });
        res.status(200).json({ message: 'Delegation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
