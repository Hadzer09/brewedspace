"use client";
import React, { ChangeEvent, FormEvent, useState } from 'react';
import Navbar from '../../components/Navbar'; 
import axios from 'axios'; 

interface BookingData {
  name: string;
  email: string; // 1. TAMBAHKAN EMAIL DI INTERFACE
  guests: string;
  date: string;
  time: string;
  purpose: string;
  specificArea: string;
  notes: string;
}

export default function BookingPage() {
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const [formData, setFormData] = useState<BookingData>({
    name: '',
    email: '', // 2. TAMBAHKAN EMAIL DI INITIAL STATE
    guests: '',
    date: '',
    time: '12:00', 
    purpose: '', 
    specificArea: '', 
    notes: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'purpose') {
        updated.specificArea = ''; 
      }
      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.purpose || !formData.specificArea) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const response = await axios.post(`${API_URL}/bookings`, {
        name: formData.name,
        email: formData.email, // 3. KIRIM DATA EMAIL KE BACKEND VIA AXIOS
        guests: parseInt(formData.guests), 
        date: formData.date,
        time: formData.time,
        purpose: formData.purpose,
        specificArea: formData.specificArea,
        notes: formData.notes
      });

      if (response.data.success) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '', // RESET EMAIL KETIKA SUKSES
          guests: '',
          date: '',
          time: '12:00',
          purpose: '',
          specificArea: '',
          notes: ''
        });
      }
    } catch (error: any) {
      console.error("Gagal mengirim reservasi:", error);
      setErrorMessage(
        error.response?.data?.message || 
        "Gagal terhubung ke server. Pastikan backend menyala."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#1A120B] text-white pt-32 pb-20 px-6 relative font-sans">
        
        {/* MODAL KONFIRMASI CUSTOM */}
        {isSubmitted && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md transition-all">
            <div className="bg-[#241a12] border border-[#D5CEA3]/20 p-10 md:p-14 rounded-[40px] max-w-lg w-full text-center shadow-[0_20px_80px_rgba(0,0,0,0.5)] relative overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D5CEA3]/5 rounded-full blur-3xl"></div>
              
              <div className="w-20 h-20 bg-[#D5CEA3] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_10px_30px_rgba(213,206,163,0.2)]">
                <svg className="w-10 h-10 text-[#1A120B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-black uppercase tracking-tighter text-[#D5CEA3] mb-4">Reservasi Diterima</h2>
              <p className="text-gray-400 leading-relaxed mb-10">
                Terima kasih. Tempat terbaik kami telah disiapkan untuk Anda. Status persetujuan meja akan dikirimkan langsung ke email Anda.
              </p>
              
              <button 
                onClick={() => setIsSubmitted(false)}
                className="w-full bg-[#D5CEA3] text-[#1A120B] py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all active:scale-95 shadow-lg"
              >
                Tutup & Kembali
              </button>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <header className="mb-12">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-[#D5CEA3]">
              Secure Your <span className="block text-white">Spot.</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base tracking-[0.1em] max-w-md leading-relaxed">
              Pilih tujuan kunjunganmu agar kami bisa merekomendasikan area terbaik di Brewed Space.
            </p>
          </header>

          <form 
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 bg-white/5 p-8 md:p-14 rounded-[40px] border border-white/10 backdrop-blur-md"
          >
            {errorMessage && (
              <div className="md:col-span-2 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs uppercase tracking-widest text-center">
                {errorMessage}
              </div>
            )}

            {/* INPUT NAMA */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D5CEA3]">Nama Reservasi</label>
              <input 
                required
                name="name"
                type="text" 
                value={formData.name}
                onChange={handleChange}
                className="bg-transparent border-b border-gray-700 py-3 focus:border-[#D5CEA3] outline-none transition-all text-lg" 
                placeholder="Masukkan nama lengkap" 
              />
            </div>

            {/* 4. TAMBAHAN BARU: INPUT EMAIL */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D5CEA3]">Alamat Email</label>
              <input 
                required
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                className="bg-transparent border-b border-gray-700 py-3 focus:border-[#D5CEA3] outline-none transition-all text-lg" 
                placeholder="nama@email.com" 
              />
            </div>

            {/* STEP 1: PILIH TUJUAN ANDA */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D5CEA3]">1. Pilih Tujuan Anda</label>
              <div className="relative border-b border-gray-700">
                <select 
                  required
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full bg-transparent py-3 focus:border-[#D5CEA3] outline-none transition-all appearance-none cursor-pointer text-lg"
                >
                  <option className="bg-[#1A120B]" value="" disabled>Pilih Tujuan...</option>
                  <option className="bg-[#1A120B]" value="Nongkrong">Makan Biasa / Nongkrong</option>
                  <option className="bg-[#1A120B]" value="Meeting">Meeting / Kerja (Private Room)</option>
                  <option className="bg-[#1A120B]" value="WFC">Work From Cafe (Solo/Duo)</option>
                  <option className="bg-[#1A120B]" value="Event">Gathering / Acara Komunitas</option>
                </select>
                <div className="absolute right-0 bottom-4 pointer-events-none text-[#D5CEA3] text-[10px] font-bold tracking-widest">PILIH ▼</div>
              </div>
            </div>

            {/* STEP 2: PILIH AREA */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D5CEA3]">2. Pilih Area</label>
              <div className="relative border-b border-gray-700">
                <select 
                  required
                  name="specificArea"
                  value={formData.specificArea}
                  onChange={handleChange}
                  className="w-full bg-transparent py-3 focus:border-[#D5CEA3] outline-none transition-all appearance-none cursor-pointer text-lg"
                >
                  <option className="bg-[#1A120B]" value="" disabled>Pilih Area Spesifik...</option>
                  
                  {(formData.purpose === "Nongkrong" || formData.purpose === "WFC") && (
                    <>
                      <option className="bg-[#1A120B]" value="Indoor (AC Area)">Indoor (AC Area)</option>
                      <option className="bg-[#1A120B]" value="Outdoor Terrace">Outdoor Terrace</option>
                      <option className="bg-[#1A120B]" value="Bar Side / High Chair">Bar Side / High Chair</option>
                    </>
                  )}

                  {formData.purpose === "Meeting" && (
                    <>
                      <option className="bg-[#1A120B]" value="The Boardroom (10 Pax)">The Boardroom (10 Pax)</option>
                      <option className="bg-[#1A120B]" value="Creative Box (4 Pax)">Creative Box (4 Pax)</option>
                    </>
                  )}

                  {formData.purpose === "Event" && (
                    <>
                      <option className="bg-[#1A120B]" value="Main Hall Center">Main Hall Center</option>
                      <option className="bg-[#1A120B]" value="Garden Backyard">Garden Backyard</option>
                    </>
                  )}
                </select>
                <div className="absolute right-0 bottom-4 pointer-events-none text-[#D5CEA3] text-[10px] font-bold tracking-widest">PILIH ▼</div>
              </div>
            </div>

            {/* JUMLAH ORANG & TANGGAL */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D5CEA3]">Jumlah Orang</label>
              <input 
                required 
                name="guests" 
                type="number" 
                value={formData.guests}
                onChange={handleChange} 
                className="bg-transparent border-b border-gray-700 py-3 outline-none text-lg" 
                placeholder="0" 
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D5CEA3]">Tanggal</label>
              <input 
                required 
                name="date" 
                type="date" 
                value={formData.date}
                onChange={handleChange} 
                className="bg-transparent border-b border-gray-700 py-3 outline-none [color-scheme:dark] text-lg text-[#D5CEA3]" 
              />
            </div>

            {/* INPUT JAM */}
            <div className="flex flex-col gap-3 md:col-span-2">
              <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D5CEA3]">Jam Kunjungan</label>
              <input 
                required 
                name="time" 
                type="time" 
                value={formData.time}
                onChange={handleChange} 
                className="bg-transparent border-b border-gray-700 py-3 outline-none [color-scheme:dark] text-lg text-white" 
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="md:col-span-2 mt-8 bg-[#D5CEA3] text-[#1A120B] py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-xl active:scale-95 disabled:bg-gray-600 disabled:text-gray-400"
            >
              {isLoading ? "Mengirim..." : "Konfirmasi Reservasi"}
            </button>
          </form>
          
          <footer className="mt-12 text-center text-gray-600 text-[9px] uppercase tracking-[0.4em]">
            Brewed Space • Priority Guest Service
          </footer>
        </div>
      </main>
    </>
  );
}