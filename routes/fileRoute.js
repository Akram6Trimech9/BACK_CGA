const express = require('express');
const multer = require('multer');
const {
    createFolder,
    renameFolder,
    deleteFolder,
    transferFolder,
    createFile,
    renameFile,
    deleteFile,
    getSubFolderAndSubFiles,
    transferFile,
    getRootFoldersAndFilesByUser
} = require('../controller/gsFolderController');  

const router = express.Router();

 const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

const upload = multer({ storage });
router.get('/folder-items/:folderId', getSubFolderAndSubFiles);

router.get('/root-items/:userId', getRootFoldersAndFilesByUser);


 router.post('/folders', createFolder);

 router.put('/folders/rename', renameFolder);

 router.delete('/folders/:folderId', deleteFolder);

 router.post('/folders/transfer', transferFolder);

 router.post('/files', upload.single('file'), createFile); 

 router.put('/files/rename', renameFile);

 router.delete('/files/:fileId', deleteFile);

 router.post('/files/transfer', transferFile);
module.exports = router;
