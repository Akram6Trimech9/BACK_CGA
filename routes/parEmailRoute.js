const express = require('express');
const router = express.Router();
const parEmailController = require('../controller/parEmailController');

 router.post('/', parEmailController.createParEmail);

 router.get('/', parEmailController.getAllParEmails);

 router.get('/avocat/:avocatId', parEmailController.getParEmailsByAvocat);

 router.get('/:id', parEmailController.getParEmailById);

 router.put('/:id', parEmailController.updateParEmail);

 router.delete('/:id', parEmailController.deleteParEmail);

module.exports = router;
