const express =  require('express')
const router = express.Router() ;
const {createRdv,getAllRdvs,acceptRdv,deleteRdv,refuseRdv,getRdvById, getRdvByUser,createRdvByGuest} = require('../controller/rdvController')
router.post('/createRdvByGuest/:avocatId', createRdvByGuest);
router.post('/:userId/:avocatId' , createRdv )
router.get('/all/:avocatId' , getAllRdvs )
router.get('/:id' , getRdvById )
router.put('/accept/:id', acceptRdv);
router.put('/refuse/:id', refuseRdv);
router.delete('/:id', deleteRdv);
router.get('/user/:id',getRdvByUser)
module.exports = router ; 