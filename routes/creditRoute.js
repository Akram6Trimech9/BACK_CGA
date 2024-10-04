const express = require('express');
const router = express.Router();
const creditController = require('../controller/creditController');

router.put('/tranch/:creditId/:trancheId' , creditController.updatePayedCreditTranche)

router.get('/invoice/:creditId/:trancheId' , creditController.getCreditInvoice)
 router.get('/:creditId', creditController.getCreditById)

router.get('/avocat/:avocatId' , creditController.getCreditsByAvocat)

 router.post('/',  creditController.createCredit);
 router.get('/',  creditController.getCredit);
 router.post('/tranch/:creditId',  creditController.addTranche);
 router.delete('/tranch/:trancheId/:creditId',  creditController.deleteTranche);
 router.put('/total/:creditId',  creditController.updateTotalCredit);
 router.delete('/:creditId',  creditController.deleteCredit);
 router.get('/client/:clientId', creditController.getCreditsByClient)

module.exports = router;
