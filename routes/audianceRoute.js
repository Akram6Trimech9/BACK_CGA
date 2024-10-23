const express = require('express');
const router = express.Router();
const upload = require('../config/multer');  

const audianceController = require('../controller/audianceController');

router.post('/intervenant/:audianceId' , audianceController.addIntervenantToAudiance); 

router.post('/:adminId/:affaireId', upload.array('files', 10), audianceController.addAudiance);

router.get('/', audianceController.getAudiances);

router.get('/:id', audianceController.getAudianceById);

router.get('/byAffaire/:affaireId', audianceController.getAudiancesByAffaire);

router.put('/:id',upload.array('files', 10) ,  audianceController.updateAudiance);

router.get('/admin/:adminId', audianceController.getAudianceByAdmin);

router.delete('/:id', audianceController.deleteAudiance); 


// addIntervenantToAudiance
module.exports = router;
