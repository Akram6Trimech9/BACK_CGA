const Guest = require('../models/guest');
const asyncHandler = require('express-async-handler'); // Middleware for error handling

// Get guest by ID
const getGuestById = asyncHandler(async (req, res) => {
  const { idGuest } = req.params;

  // Find guest by ID and await the result
  const guest = await Guest.findById(idGuest);

  if (guest) {
    res.status(200).json(guest);
  } else {
    res.status(404).json({ message: 'Guest not found' });
  }
});

module.exports = { getGuestById };
