const express = require('express');
const cors = require('cors');
const path = require('path'); 
const connectDB = require('./config/db');
const menuRoutes = require('./routes/menuRoutes');
const authRoutes = require('./routes/authRoutes'); 
const orderRoutes = require('./routes/orderRoutes'); 
// PERBAIKAN & TAMBAHAN: Import route booking baru kamu di sini
const bookingRoutes = require('./routes/bookingRoutes'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// =========================================================================
// MIDDLEWARE UTAMA
// =========================================================================

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================================================================
// EKSPOS FOLDER UPLOADS SEBAGAI STATIC FILE
// =========================================================================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =========================================================================
// ROUTING API
// =========================================================================

app.get('/', (req, res) => {
  res.send('Server Brewed Space Backend Aktif dan Berjalan!');
});

app.use('/api/menus', menuRoutes); 
app.use('/api/auth', authRoutes);  
app.use('/api', orderRoutes); 

// PERBAIKAN: Pasang middleware route booking di bawah prefix '/api'
// Supaya serasi dengan frontend yang menembak ke http://localhost:5000/api/bookings
app.use('/api', bookingRoutes); 

// =========================================================================
// PENANGANAN JALUR GAIB / ERROR HANDLING
// =========================================================================

app.use((req, res, next) => {
  res.status(404).json({ message: `Endpoint API tidak ditemukan: ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error('Terjadi error internal server:', err.stack);
  res.status(500).json({ message: 'Terjadi kegagalan internal pada server Express.' });
});

// =========================================================================
// JALANKAN SERVER & DATABASE
// =========================================================================
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Backend berjalan dengan aman di http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Server gagal berjalan karena kendala database:', error.message);
  });