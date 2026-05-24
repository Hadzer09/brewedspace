const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// HAPUS "/api", Cukup gunakan "/" atau "/orders" saja karena prefix /api sudah diatur di server.js

// 1. Endpoint untuk menyimpan order dari Checkout Frontend
// Akses via frontend: POST http://localhost:5000/api/orders
router.post('/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Gagal menyimpan pesanan", error });
  }
});

// 2. Endpoint GET untuk ditarik ke halaman ADMIN PANEL
// Akses via frontend: GET http://localhost:5000/api/orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Tampilkan dari yang paling baru
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data pesanan", error });
  }
});

module.exports = router;