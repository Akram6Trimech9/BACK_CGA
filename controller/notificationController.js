const Notification = require('../models/notifications');

exports.getNotificationByUser = async (req, res) => {
  try {
    const { idUser } = req.params;
    const notifications = await Notification.find({ user: idUser }).populate('user');

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving notifications', error: error.message });
  }
};

exports.deleteNotif = async (req, res) => {
    try {
      const { id } = req.params;
      const notifications = await Notification.findByIdAndDelete(id)
  
      if (!notifications || notifications.length === 0) {
        return res.status(404).json({ message: 'No notifications found' });
      }
  
      res.status(200).json({notif :" Deleted "});
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving notifications', error: error.message });
    }
  };