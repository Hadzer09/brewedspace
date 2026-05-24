const User = require('../models/User'); // Pastikan folder models & file User.js ada
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1. Cek Status Owner
const checkOwner = async (req, res) => {
  try {
    const ownerExist = await User.findOne({ role: 'Owner' });
    if (ownerExist) {
      return res.status(200).json({ hasOwner: true });
    }
    return res.status(200).json({ hasOwner: false });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengecek status owner: ' + error.message });
  }
};

// 2. Registrasi Owner
const registerOwner = async (req, res) => {
  try {
    const { username, password } = req.body;

    const ownerExist = await User.findOne({ role: 'Owner' });
    if (ownerExist) {
      return res.status(400).json({ message: 'Setup dikunci! Owner sudah terdaftar.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newOwner = new User({
      username,
      password: hashedPassword,
      role: 'Owner'
    });

    await newOwner.save();
    return res.status(201).json({ message: 'Registrasi Owner Berhasil!' });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal meregistrasikan owner: ' + error.message });
  }
};

// 3. Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Username atau Password salah!' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Username atau Password salah!' });
    }

    const tokenSecret = process.env.JWT_SECRET || 'brewedspace_super_secret_key';
    const token = jwt.sign(
      { id: user._id, role: user.role },
      tokenSecret,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login berhasil!',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan pada server: ' + error.message });
  }
};

// 4. Create Staff
const createStaff = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const isUserExist = await User.findOne({ username });
    if (isUserExist) {
      return res.status(400).json({ message: 'Username staf sudah terdaftar!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStaff = new User({
      username,
      password: hashedPassword,
      role
    });

    await newStaff.save();
    return res.status(201).json({ message: `Akun staf dengan role ${role} berhasil dibuat!` });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal membuat akun staf: ' + error.message });
  }
};

// Export harus berada di paling bawah luar fungsi
module.exports = {
  checkOwner,
  registerOwner,
  login,
  createStaff
};