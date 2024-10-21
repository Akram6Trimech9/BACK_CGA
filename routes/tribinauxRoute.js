const express = require('express');
const router = express.Router();
const tribunauxController = require('../controller/tribinauxController');   

 router.post('/', tribunauxController.createTribinaux);

 router.get('/', tribunauxController.getAllTribinaux);

 router.get('/:id', tribunauxController.getTribinauxById);

 router.put('/:id', tribunauxController.updateTribinaux);

 router.delete('/:id', tribunauxController.deleteTribinaux);

module.exports = router;
