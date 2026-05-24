const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    console.log('MongoDB Terkoneksi Sukses...');
  } catch (error) {
    console.error('Koneksi MongoDB Gagal:', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;