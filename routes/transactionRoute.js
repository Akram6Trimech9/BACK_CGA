const express = require('express');
const router = express.Router();
const folderTransactionController = require('../controller/transactionHistoryController.js');

 router.get('/to/:userId', folderTransactionController.getTransactionsByToUser);

 router.get('/from/:userId', folderTransactionController.getTransactionsByFromUser);

 router.get('/', folderTransactionController.getAllTransactions);

module.exports = router;
