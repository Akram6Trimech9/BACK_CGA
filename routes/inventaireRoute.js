const express = require('express');
const router = express.Router();
const {
    getInventaires,
    getInventaireById,
    createInventaire,
    updateInventaire,
    deleteInventaire
} = require('../controller/inventaireController');
router.post('/',  createInventaire);
router.get('/', getInventaires);
router.get('/:id', getInventaireById);
router.put('/:id', updateInventaire);
router.delete('/:id',deleteInventaire);
module.exports = router;