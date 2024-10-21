const express =  require('express')
const router = express.Router() ;
const upload = require("../config/imageUpload");
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware')
const {verifiedAccount ,createUserForGuest ,searchClients ,getClients ,getAvocats,verifyAccountWithCode, loginAdmin ,  resetPassword , forgotPasswordToken , updatePassword , logout , createUser , handleRefreshToken , unBlockUser , blockUser, login ,getAllUsers , getOneUser , deleteUser ,updateUser, sendVerificationLink, addSousAdmin} = require('../controller/userController') 


router.post('/forgotpassword', forgotPasswordToken )
router.post('/signup'  ,upload.single("userProfile"), createUser)
router.post('/signup/guest/:idGuest', createUserForGuest )
router.post('/signup/sous-admin/:adminId', addSousAdmin )
router.post('/login',login)
router.post('/verify-account',verifyAccountWithCode)
router.post('/loginadmin', loginAdmin )
router.patch('/password/:id',updatePassword)
router.put('/resetpassword/:token', resetPassword )
router.get('/all-users' ,getAllUsers)
router.get('/one-user/:id',getOneUser)
router.get('/refresh',handleRefreshToken)
router.get('/logout' , logout )
router.delete('/delete-user/:id',deleteUser)
router.put('/update-user/:id', updateUser)
router.put('/block-user/:id',authMiddleware , isAdmin , blockUser)
router.put('/unblock-user/:id',  unBlockUser)
router.post('/verification/:id',  sendVerificationLink)
router.get('/verifiedAccount/:token',verifiedAccount)
router.get('/avocat',getAvocats)
router.get('/client/:avocatId',getClients)
router.get('/search/client/:avocatId',searchClients)


  module.exports = router ; 