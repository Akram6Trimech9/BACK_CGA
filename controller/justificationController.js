const asyncHandler = require('express-async-handler');
const Justification = require('../models/justification');

// Create Justification
exports.createJustification = asyncHandler(async (req, res) => {
    const { date, type, situationClient, avocatAssocie, natureJugement, dateInformation } = req.body;

    console.log(req.body);

    if (type === 'Jugee') {
        // Build the justificationData object conditionally
        const justificationData = {
            type,
            ...(date && { date }), // Add `date` only if it exists
            ...(natureJugement && { natureJugement }), // Add `natureJugement` only if it exists
            ...(situationClient && { situationClient }), // Add `situationClient` only if it exists
            ...(avocatAssocie && { avocatAssocie }), // Add `avocatAssocie` only if it exists
            ...(dateInformation && { dateInformation }), // Add `dateInformation` only if it exists
            ...(req.copieJugement && { copieJugement: req.copieJugement.path }) // Add `copieJugement` only if it exists
        };

        const justification = await Justification.create(justificationData);
        res.status(201).json(justification);
    } else {
        res.status(400).json({ message: 'Justification type must be Jugee to create an entry.' });
    }
});

// Update Justification
exports.updateJustification = asyncHandler(async (req, res) => {
    const { justificationId } = req.params;
    const { date, type, situationClient, avocatAssocie, natureJugement, dateInformation } = req.body;

    console.log(req.file, "file");

    // Build the justificationData object conditionally
    const justificationData = {
        ...(date && { date }),
        ...(type && { type }),
        ...(natureJugement && { natureJugement }),
        ...(situationClient && { situationClient }),
        ...(avocatAssocie && { avocatAssocie }),
        ...(dateInformation && { dateInformation }),
        ...(req.file && { copieJugement: req.file.path }) // Add file path only if it exists
    };

    const justification = await Justification.findByIdAndUpdate(justificationId, justificationData, {
        new: true,
        runValidators: true
    });

    if (!justification) {
        return res.status(404).json({ message: 'Justification not found' });
    }

    res.json(justification);
});

// Get Justification By ID
exports.getJustificationById = asyncHandler(async (req, res) => {
    const { idJustification } = req.params;

    try {
        const justification = await Justification.findById(idJustification);

        if (justification) {
            res.status(200).json(justification);
        } else {
            res.status(404).json({ message: 'Justification not found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
