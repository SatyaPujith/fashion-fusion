
// models/Outfit.js
const mongoose = require('mongoose');

const OutfitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  top: {
    image: String,
    color: String,
  },
  bottom: {
    image: String,
    color: String,
  },
});

module.exports = mongoose.model('Outfit', OutfitSchema);