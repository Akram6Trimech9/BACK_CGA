const express = require('express');
const router = express.Router();
const delegationController = require('../controller/delegationController'); 
 router.post('/', delegationController.createDelegation);
router.get('/', delegationController.getAllDelegations);
router.get('/:id', delegationController.getDelegationById);
router.put('/:id', delegationController.updateDelegation);
router.delete('/:id', delegationController.deleteDelegation);

module.exports = router;
