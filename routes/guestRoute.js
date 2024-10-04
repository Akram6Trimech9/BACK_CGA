const express = require('express');
const router = express.Router();
const guestController = require('../controller/guestController');

 router.get('/:idGuest', guestController.getGuestById);

module.exports = router;
