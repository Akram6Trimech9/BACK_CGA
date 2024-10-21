const TransactionHistory = require('../models/folderTransactions')

exports.getTransactionsByToUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const transactions = await TransactionHistory.find({ to: userId }).populate('from to folder');
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transactions by "to" user', error });
    }
  };
  
  // Get folder transactions by 'from' user
  exports.getTransactionsByFromUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const transactions = await TransactionHistory.find({ from: userId }).populate('from to folder ');
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transactions by "from" user', error });
    }
  };
  
  // Get all folder transactions
  exports.getAllTransactions = async (req, res) => {
    try {
      const transactions = await TransactionHistory.find().populate('from to folder');
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching all transactions', error });
    }
  };