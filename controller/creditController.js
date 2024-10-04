const Credit = require('../models/credit');
const Affaire = require('../models/affaire');
const Client = require('../models/user');
const Folder = require('../models/folder');
const { generateInvoicePDF } = require('../services/invoicePart');


exports.getCreditById = async (req, res) => {
    try {
        const { creditId } = req.params;

         const credit = await Credit.findById(creditId)
            .populate('affaire')  
            .populate('client');  

         if (!credit) {
            return res.status(404).json({ message: 'Crédit non trouvé' }); // Message in French
        }

         res.status(200).json(credit);
    } catch (error) {
         res.status(500).json({
            message: 'Erreur du serveur',
            error
        });
    }
};


exports.getCreditsByAvocat = async (req, res) => {
    const { avocatId } = req.params;

    try {
        const folders = await Folder.find({ avocat: avocatId })
            .populate({
                path: 'affairs',
                populate: { path: 'credit' }  // Populate the credit field inside the affairs
            });

        if (!folders || !folders.length) {
            return res.status(404).json({ message: 'No folders found for this avocat' });
        }

        const affaireIds = folders.reduce((acc, folder) => {
            return acc.concat(folder.affairs.map(affaire => affaire._id));
        }, []);

        
        const credits = await Credit.find({ affaire: { $in: affaireIds } })
            .populate('affaire')
            .populate('client');

        if (!credits || !credits.length) {
            return res.status(404).json({ message: 'No credits found for this avocat' });
        }

        res.status(200).json(credits);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.getCreditsByClient = async (req, res) => {
    const { clientId } = req.params;
    const { page = 1, limit = 10 } = req.query; // default to page 1 and limit of 10

    try {
         const pageInt = parseInt(page);
        const limitInt = parseInt(limit);

         const skip = (pageInt - 1) * limitInt;

         const credits = await Credit.find({ client: clientId })
            .populate('affaire')
            .populate('client')
            .skip(skip)
            .limit(limitInt);

        if (!credits || credits.length === 0) {
            return res.status(404).json({ message: 'No credits found for this client' });
        }

         const totalCount = await Credit.countDocuments({ client: clientId });

        res.status(200).json({
            credits,
            totalCount,
            totalPages: Math.ceil(totalCount / limitInt),
            currentPage: pageInt,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.createCredit = async (req, res) => {
    try {
        const { totalCredit, payedCredit, affaire, client } = req.body;

        // Create new credit document
        const credit = new Credit({
            totalCredit: totalCredit,
            payedCredit: payedCredit,
            affaire: affaire,
            client: client
        });

        // Save the credit document
        const savedCredit = await credit.save();

        // If the credit is saved successfully, update the related 'Affaire' and 'Client'
        if (savedCredit) {
            const updateAffaire = await Affaire.findByIdAndUpdate(affaire, { $set: { credit: savedCredit._id } });
            if (updateAffaire) {
                const updateClient = await Client.findByIdAndUpdate(client, { $set: { credit: savedCredit._id } });
                if (updateClient) {
                   const   newCredit  = await Credit.findById(savedCredit._id)
                    .populate('affaire')
                    .populate('client');
                    return res.status(200).json({ newCredit });
                }
            }
        }
        return res.status(400).json({ message: 'Failed to create credit' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateCredit = async (req, res) => {
    try {
        const { creditId } = req.params;
        const { totalCredit, payedCredit } = req.body;

        // Find the credit by ID and update
        const updatedCredit = await Credit.findByIdAndUpdate(
            creditId,
            { totalCredit, payedCredit },
            { new: true }
        );

        if (!updatedCredit) {
            return res.status(404).json({ message: 'Credit not found' });
        }

        res.status(200).json({ updatedCredit });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

exports.deleteCredit = async (req, res) => {
    try {
        const { creditId } = req.params;

        // Find and delete the credit
        const deletedCredit = await Credit.findByIdAndDelete(creditId);

        if (!deletedCredit) {
            return res.status(404).json({ message: 'Credit not found' });
        }

        // Remove the reference from the related 'Affaire' and 'Client'
        await Affaire.findOneAndUpdate({ credit: creditId }, { $unset: { credit: "" } });
        await Client.findOneAndUpdate({ credit: creditId }, { $unset: { credit: "" } });

        res.status(200).json({ message: 'Credit deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
exports.getCredit = async (req, res) => {
    try {
        const { creditId } = req.params;

        // Find the credit by ID and populate related 'Affaire' and 'Client'
        const credit = await Credit.findById(creditId)
            .populate('affaire')
            .populate('client');

        if (!credit) {
            return res.status(404).json({ message: 'Credit not found' });
        }

        res.status(200).json(credit);
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
        })
    }
}

exports.addTranche = async (req, res) => {
    try {
        const { creditId } = req.params;
        const { part, date, method , natureTranche } = req.body;

         const credit = await Credit.findById(creditId);

        if (!credit) {
            return res.status(404).json({ message: 'Credit not found' });
        }

         credit.payedCredit.push({ part, date, method , natureTranche  });

         const updatedCredit = await credit.save();

        res.status(200).json(updatedCredit);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deleteTranche = async (req, res) => {
    try {
        const { creditId, trancheId } = req.params;

         const credit = await Credit.findById(creditId);

        if (!credit) {
            return res.status(404).json({ message: 'Credit not found' });
        }

         const trancheIndex = credit.payedCredit.findIndex(tranche => tranche._id.toString() === trancheId);

        if (trancheIndex === -1) {
            return res.status(404).json({ message: 'Tranche not found' });
        }

         credit.payedCredit.splice(trancheIndex, 1);

         const updatedCredit = await credit.save();

        res.status(200).json(updatedCredit);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateTotalCredit = async (req, res) => {
    try {
        const { creditId } = req.params;
        const { totalCredit } = req.body;

        // Find the credit by ID and update the totalCredit field
        const updatedCredit = await Credit.findByIdAndUpdate(
            creditId,
            { totalCredit },
            { new: true }
        );

        if (!updatedCredit) {
            return res.status(404).json({ message: 'Credit not found' });
        }

        res.status(200).json({ updatedCredit });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getCreditInvoice = async (req, res) => {
    const { creditId, trancheId } = req.params;
    try {
        const credit = await Credit.findById(creditId).populate('client');

        if (!credit) {
            return res.status(404).json({ message: 'Credit not found' });
        }

        const tranche = credit.payedCredit.id(trancheId);

        if (!tranche) {
            return res.status(404).json({ message: 'Tranche not found' });
        }

        // Generate the invoice PDF using the tranche information
        const invoicePath = await generateInvoicePDF({ ...credit.toObject(), payedCredit: [tranche] });

        // Download the invoice
        res.download(invoicePath, `${trancheId}.pdf`, (err) => {
            if (err) {
                console.error("Error downloading PDF:", err); // Log the download error
                return res.status(500).json({ success: false, message: 'Error downloading PDF', error: err.message });
            }
        });
    } catch (error) {
        console.error("Error generating invoice:", error); // Log the generation error
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



exports.updatePayedCreditTranche = async (req, res) => {
    try {
        const { creditId, trancheId } = req.params;
        const { part, date, method, natureTranche } = req.body; 

         const updatedCredit = await Credit.findOneAndUpdate(
            { _id: creditId, 'payedCredit._id': trancheId },   
            {
                $set: {
                    'payedCredit.$.part': part,          
                    'payedCredit.$.date': date,          
                    'payedCredit.$.method': method,     
                    'payedCredit.$.natureTranche': natureTranche  
                }
            },
            { new: true }   
        );

        if (!updatedCredit) {
            return res.status(404).json({ message: 'Credit or tranche not found' });
        }

        res.status(200).json(updatedCredit);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
