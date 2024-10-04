const ParEmail = require('../models/parMail');
const { sendWelcomeEmail } = require('../services/emailService');

exports.createParEmail = async (req, res) => {
    try {
        const { email, message, avocat } = req.body;
        
         const newParEmail = new ParEmail({
            email,
            message,
            avocat
        });

         const savedParEmail = await newParEmail.save();

         await sendWelcomeEmail(email);

         res.status(201).json(savedParEmail);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

 exports.getAllParEmails = async (req, res) => {
    try {
        // Retrieve all parEmail documents and populate the 'avocat' field
        const parEmails = await ParEmail.find().populate('avocat');
        res.status(200).json(parEmails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

 exports.getParEmailsByAvocat = async (req, res) => {
    const avocatId = req.params.avocatId;
    
    try {
        // Retrieve parEmails by avocat
        const parEmails = await ParEmail.find({ avocat: avocatId }).populate('avocat');
        if (parEmails.length === 0) {
            return res.status(404).json({ message: 'No emails found for this avocat.' });
        }
        res.status(200).json(parEmails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

 exports.getParEmailById = async (req, res) => {
    const { id } = req.params;

    try {
        const parEmail = await ParEmail.findById(id).populate('avocat');
        if (!parEmail) {
            return res.status(404).json({ message: 'Email not found.' });
        }
        res.status(200).json(parEmail);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

 exports.updateParEmail = async (req, res) => {
    const { id } = req.params;
    const { email, message, avocat } = req.body;

    try {
        const updatedParEmail = await ParEmail.findByIdAndUpdate(
            id,
            { email, message, avocat },
            { new: true }
        );
        if (!updatedParEmail) {
            return res.status(404).json({ message: 'Email not found.' });
        }
        res.status(200).json(updatedParEmail);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

 exports.deleteParEmail = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedParEmail = await ParEmail.findByIdAndDelete(id);
        if (!deletedParEmail) {
            return res.status(404).json({ message: 'Email not found.' });
        }
        res.status(200).json({ message: 'Email deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};