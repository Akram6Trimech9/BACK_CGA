const express = require('express');
const router = express.Router();
const delaiController = require('../controller/delaiController');

 router.post('/', delaiController.createDelai);

 router.get('/', delaiController.getAllDelais);

 router.get('/:id', delaiController.getDelaiById);

 router.put('/:id', delaiController.updateDelai);

 router.delete('/:id', delaiController.deleteDelai);

 router.get('/admin/filter', delaiController.getByAdmin);


 router.get('/avocat/:avocatId', delaiController.getByAvocatId);
module.exports = router;
