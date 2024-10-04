const express = require('express');
const router = express.Router();
const citiesController = require('../controller/citiesController');  

 router.post('/', citiesController.createCity);
router.get('/', citiesController.getAllCities);
router.get('/:id', citiesController.getCityById);
router.put('/:id', citiesController.updateCity);
router.delete('/:id', citiesController.deleteCity);

module.exports = router;
