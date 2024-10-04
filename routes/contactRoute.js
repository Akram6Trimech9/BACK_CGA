const express = require('express');
const router = express.Router();
const contactController = require('../controller/contactController');
 router.post('/', contactController.createContact);
 router.get('/', contactController.getAllContacts);
 router.get('/:id', contactController.getContact);
 router.patch('/:id', contactController.updateContact);
 router.delete('/:id', contactController.deleteContact);

module.exports = router;
