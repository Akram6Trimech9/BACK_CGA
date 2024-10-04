const express = require('express');
const { createAvaibility, getAvaibility, getAllAvaibilities, updateAvaibility, deleteAvaibility, getAvaibilitiesByAdmin } = require('../controller/adminAvaibilityController');
const router = express.Router();

router.post('/:adminId', createAvaibility);  
router.get('/:id', getAvaibility);  
router.get('/', getAllAvaibilities); 
router.get('/admin/:adminId', getAvaibilitiesByAdmin);  
router.put('/:id', updateAvaibility); 
router.delete('/:id', deleteAvaibility);  

module.exports = router;
