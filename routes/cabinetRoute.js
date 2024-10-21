const express = require('express');
const router = express.Router();
const cabinetController = require('../controller/cabinetController');

 router.post('/:adminId', cabinetController.createCabinet);

 router.put('/:adminId', cabinetController.updateCabinet);

 router.delete('/:cabinetId', cabinetController.deleteCabinet);

 router.get('/:adminId', cabinetController.getCabinetByAdmin);

 router.get('/', cabinetController.getAllCabinets);

 router.post('/:adminId/sousAdmin', cabinetController.addSousAdmin);

 router.delete('/:adminId/sousAdmin', cabinetController.removeSousAdmin);

 router.get('/sousadmin/:sousAdminId', cabinetController.getCabinetBySousAdmin);

 module.exports = router;
