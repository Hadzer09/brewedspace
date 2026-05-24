const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username wajib diisi'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password wajib diisi']
  },
  role: {
    type: String,
    enum: ['Owner', 'Barista', 'Stoker'],
    required: true
  }
}, {
  timestamps: true // Otomatis membuat createdAt dan updatedAt
});

// Pastikan export-nya seperti ini agar bisa di-require oleh authController
module.exports = mongoose.model('User', userSchema);