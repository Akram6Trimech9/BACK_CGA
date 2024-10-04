const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const justificationController = require('../controller/justificationController')

router.post('/:justificationId', upload.single('file'), justificationController.createJustification);

router.put('/:justificationId', upload.single('file'), justificationController.updateJustification);


router.get('/:idJustification',justificationController.getJustificationById)
module.exports = router;
