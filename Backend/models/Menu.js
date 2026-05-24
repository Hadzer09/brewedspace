const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    required: true
  },
  price: {
    type: Number, // Bertipe Number agar sinkron dengan format mata uang di frontend
    required: true
  },
  img: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  }
}, {
  timestamps: true // Otomatis membuat kolom createdAt dan updatedAt
});

module.exports = mongoose.model('Menu', MenuSchema);