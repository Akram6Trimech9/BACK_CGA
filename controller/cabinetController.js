const Cabinet = require('../models/cabinet');
const User = require('../models/user');
  
 exports.createCabinet = async (req, res) => {
  try {
    const { name, address, description, localisation } = req.body;
    const {adminId} =  req.params; 
    console.log(adminId)
    const existingCabinet = await Cabinet.findOne({ admin: adminId });
     if (existingCabinet) {
      return res.status(400).json({ message: 'Admin can only create one cabinet.' });
    }
    const newCabinet = new Cabinet({
      name,
      address,
      description,
      localisation,
      admin: adminId
    });

    await newCabinet.save();

    const updateInUSer = await  User.findByIdAndUpdate(adminId , {$set : {cabinet :existingCabinet }})
  if(updateInUSer){ 
    return res.status(201).json({ message: 'Cabinet created successfully', cabinet: newCabinet });
  }
  } catch (error) {
    return res.status(500).json({ message: 'Error creating cabinet', error });
  }
};

 exports.updateCabinet = async (req, res) => {
  try {
    const {adminId} = req.params;
     const { name, addresse, description, localisation } = req.body;
     
    const cabinet = await Cabinet.findOneAndUpdate(
      { admin: adminId },
      { $set: { name, addresse, description, localisation } },
      { new: true }
    );
    console.log(cabinet)

    if (!cabinet) {
      return res.status(404).json({ message: 'Cabinet not found or not authorized' });
    }

    return res.status(200).json({ message: 'Cabinet updated successfully', cabinet });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating cabinet', error });
  }
};

 exports.deleteCabinet = async (req, res) => {
  try {
    const {cabinetId} = req.params;

    const cabinet = await Cabinet.findByIdAndDelete(cabinetId);

    if (!cabinet) {
      return res.status(404).json({ message: 'Cabinet not found or not authorized' });
    }

    return res.status(200).json({ message: 'Cabinet deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting cabinet', error });
  }
};

 exports.getCabinetByAdmin = async (req, res) => {
  try {
    const {adminId} = req.params;

    const cabinet = await Cabinet.findOne({ admin: adminId }).populate('admin sousAdmins');

    if (!cabinet) {
      return res.status(404).json({ message: 'No cabinet found for this admin' });
    }

    return res.status(200).json(cabinet);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving cabinet', error });
  }
};

 exports.getAllCabinets = async (req, res) => {
  try {
    const cabinets = await Cabinet.find().populate('admin sousAdmins');
    return res.status(200).json(cabinets);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving cabinets', error });
  }
};

exports.addSousAdmin = async (req, res) => {
  try {
    const {adminId} =  req.params ;
    const { sousAdminId } = req.body;

    const cabinet = await Cabinet.findOneAndUpdate(
      { admin: adminId },
      { $addToSet: { sousAdmins: sousAdminId } },  
      { new: true }
    );

    if (!cabinet) {
      return res.status(404).json({ message: 'Cabinet not found or not authorized' });
    }

    return res.status(200).json({ message: 'SousAdmin added successfully', cabinet });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding sousAdmin', error });
  }
};

 exports.removeSousAdmin = async (req, res) => {
  try {
    const {adminId} =  req.params;
    const { sousAdminId } = req.body;

    const cabinet = await Cabinet.findOneAndUpdate(
      { admin: adminId },
      { $pull: { sousAdmins: sousAdminId } }, 
      { new: true }
    );

    if (!cabinet) {
      return res.status(404).json({ message: 'Cabinet not found or not authorized' });
    }

    return res.status(200).json({ message: 'SousAdmin removed successfully', cabinet });
  } catch (error) {
    return res.status(500).json({ message: 'Error removing sousAdmin', error });
  }
};

 exports.getCabinetBySousAdmin = async (req, res) => {
  try {
    const { sousAdminId } = req.params;

     const cabinet = await Cabinet.findOne({ sousAdmins: sousAdminId }).populate('admin sousAdmins');

    if (!cabinet) {
      return res.status(404).json({ message: 'No cabinet found for this sousAdmin' });
    }

    return res.status(200).json(cabinet);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving cabinet', error });
  }
};

