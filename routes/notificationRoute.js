const express =  require('express');
const { getNotificationByUser, deleteNotif } = require('../controller/notificationController');
const router = express.Router() ;
 router.get('/:idUser' , getNotificationByUser )
 router.delete('/:id' , deleteNotif )

 module.exports = router ; 