const asyncHandler = require('express-async-handler');
const GsFolder = require('../models/Gsfolder');
const Files = require('../models/file');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

exports.createFolder = asyncHandler(async (req, res) => {
    const { name, createdBy, parentFolderId = null, isRoot = false } = req.body;

    const folder = new GsFolder({
        name,
        createdBy,
        parentFolder: parentFolderId, 
        isRoot: parentFolderId ? false : isRoot 
    });

    const newFolder = await folder.save();

    if (createdBy) {
        const updatedUser = await User.findByIdAndUpdate(
            createdBy,
            { $push: { gsFolders: newFolder._id } }, 
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
    }

    if (parentFolderId) {
        const parentFolder = await GsFolder.findById(parentFolderId);
        if (!parentFolder) {
            return res.status(404).json({ error: 'Parent folder not found' });
        }

        parentFolder.subFolders.push(newFolder._id);
        await parentFolder.save();
    }

    res.status(201).json(newFolder);
});

exports.getSubFolderAndSubFiles = asyncHandler(async(req,res)=>{ 
  const  {folderId} = req.params
  const folders = await GsFolder.find({
    parentFolder: folderId,
 })
  const files = await Files.find({
    folder: folderId,
  });


         res.status(200).json({
            folders: folders,
            files: files
        });
}
)


exports.renameFolder = asyncHandler(async (req, res) => {
    const { folderId, newName } = req.body;

    const folder = await GsFolder.findById(folderId);
    if (!folder) {
        return res.status(404).json({ error: 'Folder not found' });
    }

    folder.name = newName;
    await folder.save();

    res.status(200).json(folder);
});
  

async function deleteFolderRecursively(folderId) {
    const folder = await GsFolder.findById(folderId);

    if (!folder) return;

    if (folder.files && folder.files.length > 0) {
        for (const fileId of folder.files) {
            const file = await Files.findById(fileId);
            if (file) {
                const filePath = file.path;

                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file from filesystem:', err);
                    }
                });

                // Replace file.remove() with file.deleteOne()
                await file.deleteOne();
            }
        }
    }

    if (folder.subFolders && folder.subFolders.length > 0) {
        for (const subFolderId of folder.subFolders) {
            await deleteFolderRecursively(subFolderId);
        }
    }

    await GsFolder.findByIdAndDelete(folderId);
}

 exports.deleteFolder = asyncHandler(async (req, res) => {
    const { folderId } = req.params;


    const folder = await GsFolder.findById(folderId);
    if (!folder) {
        return res.status(404).json({ error: 'Folder not found' });
    }

     if (folder.parentFolder) {
        const parentFolder = await GsFolder.findById(folder.parentFolder);
        if (parentFolder) {
            parentFolder.subFolders.pull(folderId);
            await parentFolder.save();
        }
    }

     await deleteFolderRecursively(folderId);

    res.status(204).json({ message: 'Folder and its contents deleted successfully' });
});


 
exports.createFile = asyncHandler(async (req, res) => {
    const { createdBy, folderId = null } = req.body;
    const filePath = req.file.path;  
 console.log(req.file)
    const file = new Files({
        name:req.file.originalname,
        type:req.file.mimetype,
        createdBy,
        path: filePath,  
        folder: folderId,
        isRoot: folderId ? false : true  
    });

    await file.save();

    if (folderId) {
        const folder = await GsFolder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        folder.files.push(file._id);
        await folder.save();
    }

    res.status(201).json(file);
});


 exports.renameFile = asyncHandler(async (req, res) => {
    const { fileId, newName } = req.body;

    const file = await Files.findById(fileId);
    if (!file) {
        return res.status(404).json({ error: 'File not found' });
    }

    file.name = newName;
    await file.save();

    res.status(200).json(file);
});

 exports.deleteFile = asyncHandler(async (req, res) => {
    const { fileId } = req.params;

    const file = await Files.findById(fileId);
    if (!file) {
        return res.status(404).json({ error: 'File not found' });
    }

     fs.unlink(file.path, (err) => {
        if (err) {
            console.error('Error deleting file from filesystem:', err);
            return res.status(500).json({ error: 'Error deleting file from filesystem' });
        }
    });

     await file.deleteOne();  

    res.status(204).json({ message: 'File deleted successfully' });
});



exports.transferFile = asyncHandler(async (req, res) => {
    const { fileId, userId } = req.body;

     if (!fileId || !userId) {
        return res.status(400).json({ error: 'File ID and User ID are required' });
    }

     const file = await Files.findById(fileId);
    if (!file) {
        return res.status(404).json({ error: 'File not found' });
    }

     if (!file.transferredTo.includes(userId)) {
        file.transferredTo.push(userId);  
    } else {
        return res.status(400).json({ error: 'File already transferred to this user' });
    }

     await file.save();

    res.status(200).json(file);  
});

exports.transferFolder = asyncHandler(async (req, res) => {
    const { folderId, userId } = req.body;

    const folder = await GsFolder.findById(folderId).populate('subFolders files');
    if (!folder) {
        return res.status(404).json({ error: 'Folder not found' });
    }
    if (!folder.transferredTo.includes(userId)) {
        folder.transferredTo.push(userId);  

        
    }else {
        return res.status(400).json({ error: 'folder already transferred to this user' });
    }
     await folder.save();

    // await Promise.all(folder.subFolders.map(async (subFolderId) => {
    //     const subFolder = await GsFolder.findById(subFolderId);
    //     subFolder.transferredTo = userId;
    //     await subFolder.save();
    // }));

    res.status(200).json(folder);
});

 exports.getRootFoldersAndFilesByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch root folders created by or transferred to the user
        const rootFolders = await GsFolder.find({
            isRoot: true,
            $or: [
                { createdBy: userId },    
                { transferredTo: userId }  
            ]
        });

         const rootFiles = await Files.find({
            createdBy: userId,
            isRoot: true
        });

         res.status(200).json({
            folders: rootFolders,
            files: rootFiles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching folders and files." });
    }
});


