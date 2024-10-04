const express = require('express');
const router = express.Router();
const affaireController = require('../controller/affaireController');
const upload = require('../config/multer');


router.get('/avocat/:avocatId', affaireController.getAllAffairesByAvocat);

router.post('/intervenant/:affaireId', affaireController.addIntervenantToAffaire); 


 router.post('/:folderId', upload.single('file'), affaireController.createAffaire);

 router.put('/:affaireId', upload.single('file'), affaireController.updateAffaire);


 router.get('/dossier/:folderId',  affaireController.getAffaireByFolder);


 router.get('/admin/:adminId',  affaireController.getAffaireByAdmin);
 router.get('/client/:clientId',  affaireController.getAffaireClient);

 router.get('/:affaireId', affaireController.getAffaireById);
 
 router.get('/generatePdf/:affaireId', affaireController.generatePdf);

  router.delete('/:affaireId', affaireController.deleteAffaire);

 
module.exports = router;
