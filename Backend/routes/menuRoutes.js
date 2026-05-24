const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer'); // 1. Import multer
const { getAllMenus, createMenu, updateMenu, deleteMenu } = require('../controllers/menuController');

// 2. Konfigurasi penyimpanan file
// File akan disimpan di folder 'uploads' di direktori backend
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// =========================================================================
// MIDDLEWARE JALUR LOKAL (VALIDASI ID MONGOOSE)
// =========================================================================
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      message: "Format ID Menu tidak valid atau rusak." 
    });
  }
  next();
};

// =========================================================================
// DAFTAR ENDPOINT API
// =========================================================================

router.get('/', getAllMenus);

// 3. Tambahkan upload.single('image') di sini
// 'image' harus sama dengan nama key yang di-append di FormData frontend
router.post('/', upload.single('image'), createMenu); 

router.put('/:id', validateObjectId, updateMenu);
router.delete('/:id', validateObjectId, deleteMenu);

module.exports = router;