const express = require('express');
const router = express.Router();
const depenseController = require('../controller/depenseController');


router.post('/resources', depenseController.createResource);

router.get('/status/:adminId', depenseController.getDepenseStatus);

router.post('/', depenseController.createDepense);

router.put('/', depenseController.updateDepense);


router.delete('/resources/:adminId/:resourceId', depenseController.removeResource);

router.put('/resources/:depenseId/:resourceId', depenseController.updateResource);

router.get('/resources/:adminId', depenseController.getAllResources);

router.get('/total/admin/:adminId', depenseController.getTotalByAdmin);

router.get('/total/:depenseId', depenseController.getTotal);

router.put('/total/:depenseId/:total', depenseController.updateTotal);

module.exports = router;
