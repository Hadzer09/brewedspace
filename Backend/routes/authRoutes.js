const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Kebal Crash: Validasi apakah file controller mengembalikan fungsi yang dicari
if (!authController || typeof authController.login !== 'function') {
  console.error('\n❌ ERROR KRITIKAL: File controllers/authController.js tidak meng-export fungsi dengan benar!');
  console.error('Pastikan di akhir file authController.js terdapat module.exports = { checkOwner, registerOwner, login, createStaff };\n');
}

// Mapping Endpoint menggunakan instance object controller langsung
router.post('/login', authController.login);
router.post('/register-owner', authController.registerOwner);
router.post('/create-staff', authController.createStaff);
router.get('/check-owner', authController.checkOwner); 

module.exports = router;