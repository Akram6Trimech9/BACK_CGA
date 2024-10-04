const express = require('express');
const router = express.Router();
const messageController = require('../controller/messageController');

 router.post('/', messageController.createMessage);

 router.get('/:id', messageController.getMessageByIdUser);


 router.get('/email/:email', messageController.getMessgaeByEmail);

 router.delete('/:id', messageController.deleteMessage);

module.exports = router;
