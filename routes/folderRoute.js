const express = require('express');
const router = express.Router();
const folderController = require('../controller/folderController');

router.post('/', folderController.createFolder);
router.get('/avocat/:avocatId', folderController.getFoldersByAvocat);
router.get('/client/:clientId', folderController.getFoldersByClient);
router.get('/:id', folderController.getFolderById);
router.put('/:id', folderController.updateFolder);
router.delete('/:id', folderController.deleteFolder);
router.put('/:id/executed', folderController.updateExecutedStatus);
router.put('/:id/rectified', folderController.updateRectifiedStatus);

module.exports = router;
