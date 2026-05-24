const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  guests: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  purpose: { type: String, required: true },
  specificArea: { type: String, required: true },
  notes: { type: String, default: "" },
  status: { type: String, default: "pending" } // pending, confirmed, cancelled
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);