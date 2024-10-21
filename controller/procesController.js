const Proces = require('../models/proces')
const Folder = require('../models/folder')

exports.createProces = async (req, res) => {
    try {
        const { nbreTribunal, tribunal , file, year } = req.body;
        const {folderId } = req.params
         const filePath = req.file ? req.file.path : file;  

        const newProces = new Proces({
            nbreTribunal,
            tribunal,
            year,
            folder: folderId,
            file: filePath,
         });

        const savedProces = await newProces.save();
        await Folder.findByIdAndUpdate(
            folderId,
            { $push: { proces: savedProces._id } },
            { new: true }
        );

        res.status(201).json({ success: true, data: savedProces });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.findByFolder = async (req, res) => {
    try {
        const { folderId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const processes = await Proces.find({ folder: folderId })
            .limit(limit * 1)   
            .skip((page - 1) * limit)
            .exec();

        const count = await Proces.countDocuments({ folder: folderId });

        res.status(200).json({
            success: true,
            data: processes,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.findByClient = async (req, res) => {
    try {
        const { clientId } = req.params;  
        const { page = 1, limit = 10 } = req.query;

        const processes = await Proces.find({ client: clientId }) 
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Proces.countDocuments({ client: clientId });

        res.status(200).json({
            success: true,
            data: processes,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const paginate = async (Model, filter, page, limit) => {
    const data = await Model.find(filter)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
    
    const count = await Model.countDocuments(filter);
    return {
        data,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    };
};
exports.updateProces = async (req, res) => {
    try {
        const { procesId } = req.params;
        const { nbreTribunal, tribunal, year, file } = req.body;
        const filePath = req.file ? req.file.path : file;

         const updatedProces = await Proces.findByIdAndUpdate(
            procesId,
            {
                nbreTribunal,
                tribunal,
                year,
                file: filePath
            },
            { new: true } 
        );

        if (!updatedProces) {
            return res.status(404).json({ success: false, message: 'Proces not found' });
        }

        res.status(200).json({ success: true, data: updatedProces });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};