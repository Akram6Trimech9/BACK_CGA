const express = require('express');
const router = express.Router();
const documentsController = require('../controller/documentController');
const multer = require('multer');

 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

 router.post('/', upload.single('file'), documentsController.createDocument);
router.get('/', documentsController.getAllDocuments);
router.get('/oneDocument/:id', documentsController.getDocumentById);
router.patch('/:id',  upload.single('file'), documentsController.updateDocument);
router.delete('/:id', documentsController.deleteDocument);

module.exports = router;
