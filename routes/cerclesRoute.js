const express = require('express');
const router = express.Router();
const cercleController = require('../controller/cercleController');  

router.post('/', cercleController.createCercle);
router.get('/', cercleController.getAllCercles);
router.get('/:id', cercleController.getCercleById);
router.put('/:id', cercleController.updateCercle);
router.delete('/:id', cercleController.deleteCercle);

module.exports = router;
