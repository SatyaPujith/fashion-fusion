// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '/placeholder.svg?height=100&width=100' },
  bio: { type: String, default: 'New Fashion Fusion user' },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', UserSchema);


