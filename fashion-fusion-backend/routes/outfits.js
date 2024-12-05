// routes/outfits.js
const express = require('express');
const router = express.Router();
const Outfit = require('../models/Outfit');
const auth = require('../middleware/auth');

// Create an outfit
router.post('/', auth, async (req, res) => {
  try {
    const newOutfit = new Outfit({
      user: req.user.id,
      top: req.body.top,
      bottom: req.body.bottom,
    });
    const outfit = await newOutfit.save();
    res.json(outfit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user's outfits
router.get('/', auth, async (req, res) => {
  try {
    const outfits = await Outfit.find({ user: req.user.id });
    res.json(outfits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;