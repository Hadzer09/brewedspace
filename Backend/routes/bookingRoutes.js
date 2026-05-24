const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer'); // 1. IMPORT NODEMAILER

// SCHEMA MONGOOSE (Tambahkan field email jika belum ada)
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }, // Pastikan ada email untuk dikirimi notifikasi
  guests: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  purpose: { type: String, required: true },
  specificArea: { type: String, required: true },
  notes: { type: String, default: null },
  status: { type: String, default: 'pending' } 
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// =========================================================================
// CONFIGURATION NODEMAILER
// =========================================================================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// FUNGSI UTAMA UNTUK KIRIM EMAIL NOTIFIKASI
const sendStatusEmail = async (userEmail, userName, status, bookingDetails) => {
  const isConfirmed = status === 'confirmed';
  
  const mailOptions = {
    from: `"Brewed Space" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: isConfirmed ? '🟢 Reservasi Meja Anda DITERIMA! - Brewed Space' : '🔴 Update Reservasi Meja - Brewed Space',
    html: `
      <div style="font-family: sans-serif; padding: 20px; background-color: #1A120B; color: #ffffff; max-w: 600px; margin: auto; border-radius: 20px;">
        <h2 style="color: #D5CEA3; text-transform: uppercase; border-bottom: 2px solid rgba(213,206,163,0.2); padding-bottom: 10px;">
          ${isConfirmed ? 'Reservasi Dikonfirmasi!' : 'Reservasi Dibatalkan'}
        </h2>
        <p>Halo <strong>${userName}</strong>,</p>
        <p>
          ${isConfirmed 
            ? 'Kabar baik! Permintaan reservasi meja Anda di Brewed Space telah disetujui oleh tim kami. Berikut adalah rincian tempat Anda:' 
            : 'Mohon maaf, karena keterbatasan slot atau adanya private event, kami belum bisa menerima reservasi Anda untuk waktu berikut:'}
        </p>
        
        <div style="background-color: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #D5CEA3;">
          <p style="margin: 5px 0;"><strong>Area:</strong> ${bookingDetails.specificArea} (${bookingDetails.purpose})</p>
          <p style="margin: 5px 0;"><strong>Tanggal & Jam:</strong> ${bookingDetails.date} @ ${bookingDetails.time} WIB</p>
          <p style="margin: 5px 0;"><strong>Jumlah Tamu:</strong> ${bookingDetails.guests} Orang</p>
        </div>

        ${isConfirmed 
          ? '<p style="color: #D5CEA3;"><em>Sampai jumpa di Brewed Space! Mohon datang 15 menit sebelum waktu reservasi.</em></p>' 
          : '<p>Silakan lakukan reservasi kembali di hari atau jam lain, atau hubungi langsung CS kami.</p>'}
          
        <hr style="border: none; border-top: 1px solid rgba(213,206,163,0.2); margin-top: 30px;">
        <p style="font-size: 11px; color: #777; text-align: center;">Brewed Space • Priority Guest Service</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email notifikasi status [${status}] berhasil dikirim ke ${userEmail}`);
  } catch (error) {
    console.error('Gagal mengirim email:', error);
  }
};

// =========================================================================
// ROUTE POST & GET (Tetap Sama Seperti Sebelumnya)
// =========================================================================
router.post('/bookings', async (req, res) => {
  try {
    const { name, email, guests, date, time, purpose, specificArea, notes } = req.body;
    if (!name || !email || !guests || !date || !time || !purpose || !specificArea) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap.' });
    }
    const newBooking = new Booking({ name, email, guests: parseInt(guests), date, time, purpose, specificArea, notes });
    await newBooking.save();
    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
});

router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings); 
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal data.' });
  }
});

// =========================================================================
// 3. ENDPOINT PUT (UPDATE STATUS + TRIGGER EMAIL NOTIFIKASI)
// =========================================================================
router.put('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'confirmed' atau 'cancelled'

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status harus diisi.' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Data reservasi tidak ditemukan.' });
    }

    // 🔥 TRIGER KIRIM EMAIL SECARA ASYNC (Agar response API admin tetap cepat)
    sendStatusEmail(updatedBooking.email, updatedBooking.name, status, updatedBooking);

    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error('Error saat update status booking:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui status reservasi.' });
  }
});

module.exports = router;