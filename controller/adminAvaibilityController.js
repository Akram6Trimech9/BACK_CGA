const AdminAvaibility = require('../models/adminAvaibility');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

 const createAvaibility = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const { date, startTime, endTime } = req.body;

  try {
    const newAdminAvaibility = new AdminAvaibility({
      date,
      startTime,
      endTime,
      admin: adminId,
    });

    const savedAvaibility = await newAdminAvaibility.save();

    if (savedAvaibility) {
      await User.findByIdAndUpdate(
        adminId,
        { $push: { adminAvaibilities: savedAvaibility._id } },
        { new: true }
      );
      res.status(201).json(savedAvaibility);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

 const getAvaibility = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const avaibility = await AdminAvaibility.findById(id).populate('admin');
    if (!avaibility) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    res.status(200).json(avaibility);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

 const getAllAvaibilities = asyncHandler(async (req, res) => {
  try {
    const avaibilities = await AdminAvaibility.find().populate('admin');
    res.status(200).json(avaibilities);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

 const updateAvaibility = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date, startTime, endTime } = req.body;

  try {
    const updatedAvaibility = await AdminAvaibility.findByIdAndUpdate(
      id,
      { date, startTime, endTime },
      { new: true }
    );

    if (!updatedAvaibility) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    res.status(200).json(updatedAvaibility);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

 const deleteAvaibility = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const avaibility = await AdminAvaibility.findByIdAndDelete(id);

    if (!avaibility) {
      return res.status(404).json({ message: 'Availability not found' });
    }

     await User.findByIdAndUpdate(avaibility.admin, {
      $pull: { adminAvaibilities: avaibility._id },
    });

    res.status(200).json({ message: 'Availability deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
const getAvaibilitiesByAdmin = asyncHandler(async (req, res) => {
    const { adminId } = req.params;
  
    try {
       const avaibilities = await AdminAvaibility.find({ admin: adminId }).populate('admin');
  
      if (!avaibilities || avaibilities.length === 0) {
        return res.status(404).json({ message: 'No availabilities found for this admin' });
      }
  
      res.status(200).json(avaibilities);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
module.exports = {
  createAvaibility,
  getAvaibility,
  getAllAvaibilities,
  updateAvaibility,
  deleteAvaibility,
  getAvaibilitiesByAdmin
};
