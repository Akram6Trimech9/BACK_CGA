const express = require('express');
const router = express.Router();
const procesController = require('../controller/procesController');
const upload = require('../config/multer');

router.post('/:folderId', upload.single('file'), procesController.createProces);
router.get('/folder/:folderId', procesController.findByFolder);
router.get('/client/:clientId', procesController.findByClient);
router.put('/:procesId', upload.single('file'), procesController.updateProces);
module.exports = router;
