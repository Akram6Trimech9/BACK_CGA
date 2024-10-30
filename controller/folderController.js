const Folder = require('../models/folder');
const User = require('../models/user');
const Affaire = require('../models/affaire');
const FolderTransaction = require('../models/folderTransactions');


const transferFolder = async (req, res) => {
    try {
        const { folderId, fromUserId, toUserId, message } = req.body;

        if (!folderId || !fromUserId || !toUserId || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        const fromUser = await User.findById(fromUserId);
        const toUser = await User.findById(toUserId);
        if (!fromUser) {
            return res.status(404).json({ message: 'From user not found' });
        }
        if (!toUser) {
            return res.status(404).json({ message: 'To user not found' });
        }

        folder.avocat = toUserId;
        await folder.save();

        const folderTransaction = new FolderTransaction({
            from: fromUserId,
            to: toUserId,
            message: message,
            folder: folderId
        });
        await folderTransaction.save();

        // fromUser.folders = fromUser.folders.filter(f => f.toString() !== folderId);
        // await fromUser.save();

        toUser.folders.push(folder._id);
        await toUser.save();

        res.status(200).json({ message: 'Folder transferred successfully', folder });
    } catch (error) {
        res.status(500).json({ message: 'Error transferring folder', error: error.message });
    }
};

const createFolder = async (req, res) => {
    try {
        const { titleFolder, numberFolder, client, avocat } = req.body;

        console.log(req.body)
        if (!titleFolder || !numberFolder || !client || !avocat) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const clientFinded = await User.findById(client);
        const avocatFinded = await User.findById(avocat);

        if (!clientFinded) {
            return res.status(404).json({ message: 'Client not found' });
        }

        if (!avocatFinded) {
            return res.status(404).json({ message: 'Avocat not found' });
        }

        const newFolder = new Folder({
            titleFolder,
            numberFolder,
            client,
            avocat
        });
         await newFolder.save();

        clientFinded.folders = clientFinded.folders || [];
        clientFinded.folders.push(newFolder._id);

        avocatFinded.folders = avocatFinded.folders || [];
        avocatFinded.folders.push(newFolder._id);

        await clientFinded.save();
        await avocatFinded.save();


        const folderRes = await Folder.findById(newFolder._id).populate('client').populate('avocat')


        res.status(201).json(folderRes);
    } catch (error) {
        res.status(500).json({ message: 'Error creating folder', error: error.message });
    }
};
const getFoldersByAvocat = async (req, res) => {
    try {
        const avocatId = req.params.avocatId;
        const { page = 1, limit = 10, searchNumber, searchTitle, clientId, isRectified, isExecuted } = req.query;

        // Build the filter based on query parameters
        const filter = {
            avocat: avocatId,
            ...(searchNumber && {
                numberFolder: Number(searchNumber) 
            }),
            ...(searchTitle && {
                titleFolder: { $regex: searchTitle, $options: 'i' } 
            }),
            ...(clientId && {
                client: clientId  
            }),
            ...(typeof isRectified !== 'undefined' && { isRectified: isRectified === 'true' }),
            ...(typeof isExecuted !== 'undefined' && { isExecuted: isExecuted === 'true' }),
        };

        const folders = await Folder.find(filter)
            .populate('client avocat')
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalFolders = await Folder.countDocuments(filter);

        res.status(200).json({
            folders,
            totalPages: Math.ceil(totalFolders / limit),
            currentPage: Number(page),
            totalItems: totalFolders,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const getFoldersByClient = async (req, res) => {
    try {
        const clientId = req.params.clientId;
        console.log(clientId)
        const folders = await Folder.find({ client: clientId }).populate('client avocat affairs');

        console.log(folders.length)

        if (!folders.length) {
            return res.status(404).json({ message: 'No folders found for this client' });
        }


        let affaires = []
        folders.forEach(folder => {
            if (folder.affairs) {
                affaires.push(...folder.affairs)
            }
        });
        res.status(200).json(affaires);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getFolderById = async (req, res) => {
    try {
        const folderId = req.params.id;
        const folder = await Folder.findById(folderId).populate('client avocat');
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        res.status(200).json(folder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateFolder = async (req, res) => {
    try {
        const folderId = req.params.id;
        const updates = req.body;
        const updatedFolder = await Folder.findByIdAndUpdate(folderId, updates, { new: true }).populate('client avocat');
        if (!updatedFolder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        res.status(200).json(updatedFolder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteFolder = async (req, res) => {
    try {
        const folderId = req.params.id;
        const deletedFolder = await Folder.findByIdAndDelete(folderId);

        if (!deletedFolder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        await User.updateMany(
            { $or: [{ folders: folderId }] },
            { $pull: { folders: folderId } }
        );

        res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateExecutedStatus = async (req, res) => {
    try {
        const folderId = req.params.id;
        const { isExecuted } = req.body;

        const updatedFolder = await Folder.findByIdAndUpdate(
            folderId,
            { isExecuted },
            { new: true }
        ).populate('client avocat');

        if (!updatedFolder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        res.status(200).json(updatedFolder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateRectifiedStatus = async (req, res) => {
    try {
        const folderId = req.params.id;
        const { isRectified } = req.body;

        const updatedFolder = await Folder.findByIdAndUpdate(
            folderId,
            { isRectified },
            { new: true }
        ).populate('client avocat');

        if (!updatedFolder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        res.status(200).json(updatedFolder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createFolder,
    getFoldersByAvocat,
    getFoldersByClient,
    getFolderById,
    updateFolder,
    deleteFolder,
    updateExecutedStatus,
    updateRectifiedStatus,
    transferFolder
};
