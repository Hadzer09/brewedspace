'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Konfigurasi URL utama ke Backend Express.js + MongoDB kamu
const API_URL = 'http://localhost:5000/api';

export default function AdminPage() {
  // DATABASE LIVE DARI BACKEND NODE.JS + MONGODB
  const [menuDatabase, setMenuDatabase] = useState<any[]>([]);
  const [ordersDatabase, setOrdersDatabase] = useState<any[]>([]); 
  const [bookingsDatabase, setBookingsDatabase] = useState<any[]>([]); // <-- STATE LIVE UNTUK DATA RESERVASI MEJA/BOOKING
  const [hasOwnerRegistered, setHasOwnerRegistered] = useState(false);

  // State Otentikasi & Navigasi Dashboard Internal
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState(''); 
  const [errorMsg, setErrorMsg] = useState('');
  
  // State Navigasi Menu Sidebar Aktif
  const [activeTab, setActiveTab] = useState('stok'); 

  // State Input Tambah Menu Baru (Tab Kelola Stok)
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Minuman');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // State Input Pembuatan Akun Baru (Oleh Owner untuk Staf)
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Barista');

  // State Form Registrasi Pertama Kali (First Install Setup)
  const [setupUsername, setSetupUsername] = useState('');
  const [setupPassword, setSetupPassword] = useState('');

  // =========================================================================
  // EFFECT UNTUK SINKRONISASI DATA DARI MONGODB
  // =========================================================================
  useEffect(() => {
    checkOwnerStatus();
    fetchMenuData();
    fetchOrderData(); 
    fetchBookingData(); // Ambil data reservasi pertama kali saat diload
  }, []);

  // Interval polling ringan agar data otomatis ter-refresh setiap 10 detik
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        if (activeTab === 'laporan') fetchOrderData();
        if (activeTab === 'reservasi') fetchBookingData(); // Polling otomatis khusus tab reservasi
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, activeTab]);

  // Cek Apakah Owner Sudah Terdaftar
  const checkOwnerStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/check-owner`);
      setHasOwnerRegistered(response.data.hasOwner);
    } catch (error) {
      console.error("Gagal mengecek status owner dari Express + MongoDB:", error);
    }
  };

  // Mengambil data menu dari MongoDB
  const fetchMenuData = async () => {
    try {
      const response = await axios.get(`${API_URL}/menus`);
      setMenuDatabase(response.data);
    } catch (error) {
      console.error("Gagal mengambil data menu dari MongoDB:", error);
    }
  };

  // Mengambil data pesanan transaksi dari MongoDB
  const fetchOrderData = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrdersDatabase(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan dari MongoDB:", error);
    }
  };

  // FUNGSI BARU: Mengambil data Reservasi Meja dari MongoDB
  const fetchBookingData = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings`);
      // Sesuaikan jika response Express kamu berbentuk object, misal: response.data.data
      setBookingsDatabase(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data reservasi meja dari MongoDB:", error);
    }
  };

  // FUNGSI BARU: Update Status Reservasi (Selesai / Batal) langsung ke Express
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await axios.put(`${API_URL}/bookings/${bookingId}`, { status: newStatus });
      alert(`Status reservasi berhasil diperbarui menjadi ${newStatus}!`);
      fetchBookingData(); // Refresh data
    } catch (error) {
      console.error("Gagal mengupdate status reservasi:", error);
      alert("Gagal memperbarui status reservasi.");
    }
  };

  // Fungsi Mendaftarkan Owner Pertama Kali
  const handleFirstTimeSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/register-owner`, {
        username: setupUsername,
        password: setupPassword,
        role: 'Owner'
      });

      alert('Registrasi Awal Sukses! Akun Super Admin / Owner berhasil dibuat di MongoDB. Pintu setup kini dikunci selamanya.');
      setHasOwnerRegistered(true);
      setSetupUsername('');
      setSetupPassword('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal meregistrasikan owner baru.');
    }
  };

  // Fungsi Handler Login Dinamis
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: usernameInput,
        password: passwordInput
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      setIsLoggedIn(true);
      setCurrentRole(response.data.user.role); 
      setErrorMsg('');
      setActiveTab('stok');
      fetchOrderData();
      fetchBookingData(); // Load data reservasi setelah login
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Username atau Password yang Anda masukkan salah!');
    }
  };

  // Fungsi Tambah Menu Baru
  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !imageFile) return alert('Mohon isi semua data menu termasuk foto!');

    try {
      const cleanPrice = Number(String(price).replace(/[\.,]/g, ''));
      if (isNaN(cleanPrice) || cleanPrice <= 0) return alert('Harga tidak valid!');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('nama', title);
      formData.append('category', category);
      formData.append('kategori', category);
      formData.append('price', String(cleanPrice));
      formData.append('harga', String(cleanPrice));
      formData.append('description', description);
      formData.append('image', imageFile); 

      await axios.post(`${API_URL}/menus`, formData);

      alert('Menu baru berhasil disimpan!');
      fetchMenuData();
      
      setTitle('');
      setPrice('');
      setDescription('');
      setImageFile(null);
    } catch (error: any) {
      console.error(error);
      alert('Gagal menyimpan menu. Pastikan server mendukung upload file.');
    }
  };

  // Fungsi Pembuatan Akun Staf Baru oleh Owner
  const handleCreateStaffAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/create-staff`, {
        username: newUsername,
        password: newPassword,
        role: newStaffRole
      });

      alert(`Sukses! Akun ${newStaffRole} dengan username "${newUsername}" berhasil didaftarkan ke MongoDB.`);
      setNewUsername('');
      setNewPassword('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal mendaftarkan akun staf baru.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentRole('');
    setUsernameInput('');
    setPasswordInput('');
  };

  // =========================================================================
  // LOGIKA ANALISIS LAPORAN DARI DATABASE SECARA DINAMIS
  // =========================================================================
  const totalOmset = ordersDatabase.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const totalTransaksi = ordersDatabase.length;
  const rataRataBill = totalTransaksi > 0 ? Math.round(totalOmset / totalTransaksi) : 0;

  const getProdukTerlaris = () => {
    const itemMap: { [key: string]: number } = {};
    ordersDatabase.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          itemMap[item.title] = (itemMap[item.title] || 0) + (item.quantity || 0);
        });
      }
    });

    return Object.keys(itemMap)
      .map(title => ({ title, qty: itemMap[title] }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 3);
  };

  const topProducts = getProdukTerlaris();
  const maxQty = topProducts[0]?.qty || 1;

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-slate-900 flex items-center justify-center p-4 z-[9999]">
        {!hasOwnerRegistered ? (
          <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-amber-500 w-full max-w-md transition-all">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner">🛠️</div>
              <h2 className="text-xl font-extrabold text-slate-800">First-Time System Setup</h2>
              <p className="text-xs text-slate-400 mt-1">Sistem mendeteksi belum ada Owner. Silakan daftarkan akun pemilik utama kafe Anda.</p>
            </div>
            <form onSubmit={handleFirstTimeSetup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Username Owner Utama</label>
                <input type="text" placeholder="Masukkan username owner..." value={setupUsername} onChange={(e) => setSetupUsername(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Password Owner Utama</label>
                <input type="password" placeholder="Buat password yang kuat..." value={setupPassword} onChange={(e) => setSetupPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-sm transition shadow-md uppercase tracking-wider">Daftarkan Owner & Kunci Sistem</button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md transition-all">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner">🔒</div>
              <h2 className="text-xl font-extrabold text-slate-800">BrewedSpace Management</h2>
              <p className="text-xs text-slate-400 mt-1">Masukkan kredensial akun Anda untuk membuka panel kontrol</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Username</label>
                <input type="text" placeholder="Masukkan username..." value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Password</label>
                <input type="password" placeholder="Masukkan password..." value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
              </div>
              {errorMsg && <p className="text-xs text-red-500 font-semibold text-center bg-red-50 py-2 rounded-lg border border-red-100">⚠️ {errorMsg}</p>}
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm transition shadow-md">Masuk ke Dashboard</button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen flex bg-slate-100 text-slate-800 font-sans z-[9999]">
      {/* SIDEBAR UTAMA */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col justify-between shadow-2xl h-full border-r border-slate-800">
        <div>
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-lg font-black tracking-widest text-amber-400">BREWED.SPACE</h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase mt-0.5">Sistem Kendali Internal</p>
          </div>

          <nav className="p-4 space-y-1.5">
            <button onClick={() => setActiveTab('stok')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition ${activeTab === 'stok' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-300 hover:bg-slate-900'}`}>
              <span>📦</span>
              <span>Kelola Stok & Menu</span>
            </button>

            {/* TAB BARU: LIVE DATA RESERVASI MEJA (Akses: Owner & Barista/Kasir) */}
            {currentRole !== 'Stoker' && (
              <button onClick={() => { setActiveTab('reservasi'); fetchBookingData(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition ${activeTab === 'reservasi' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-300 hover:bg-slate-900'}`}>
                <span>📅</span>
                <span>Reservasi Meja Live</span>
              </button>
            )}

            {currentRole !== 'Stoker' && (
              <button onClick={() => { setActiveTab('laporan'); fetchOrderData(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition ${activeTab === 'laporan' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-300 hover:bg-slate-900'}`}>
                <span>📈</span>
                <span>Lihat Laporan Kafe</span>
              </button>
            )}
            
            {currentRole === 'Owner' && (
              <button onClick={() => setActiveTab('izin-akun')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition ${activeTab === 'izin-akun' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-300 hover:bg-slate-900'}`}>
                <span>🛡️</span>
                <span>Izin Pembuatan Akun</span>
              </button>
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="text-xs text-center mb-3">Otoritas: <span className="text-amber-400 font-bold">{currentRole}</span></div>
          <button onClick={handleLogout} className="w-full text-xs bg-red-900/30 hover:bg-red-900/60 text-red-400 font-medium py-2 rounded-lg transition border border-red-900/40">🚪 Keluar Sistem (Logout)</button>
        </div>
      </aside>

      {/* AREA KONTEN SEBELAH KANAN SIDEBAR */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white h-16 flex items-center justify-between px-8 border-b border-slate-200 shadow-sm">
          <h2 className="text-md font-bold text-slate-700 uppercase tracking-wide">
            {activeTab === 'stok' && '📦 Manajemen Inventori & Stok Katalog'}
            {activeTab === 'reservasi' && '📅 Data Reservasi & Penjadwalan Meja Pelanggan'}
            {activeTab === 'laporan' && '📈 Dashboard Omset & Analisis Penjualan'}
            {activeTab === 'izin-akun' && '🛡️ Otorisasi Akun Pegawai Baru'}
          </h2>
          <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider">Sistem Enkripsi Aktif</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          
          {/* TAB 1: KELOLA STOK */}
          {activeTab === 'stok' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
                <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">➕ Tambah Menu Baru</h3>
                <form onSubmit={handleAddMenu} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Produk</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Misal: Avocado Coffee Float" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-amber-500" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deskripsi</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi singkat menu..." className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Upload Foto</label>
                    <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={(e) => { if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]); }} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer border border-slate-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kategori</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-amber-500">
                      <option value="Bakery">🥐 Bakery</option>
                      <option value="Makanan">🍛 Makanan</option>
                      <option value="Minuman">☕ Minuman</option>
                      <option value="Sweets">🍰 Sweets</option>
                      <option value="Sides">🍟 Sides</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Harga Jual (Rp)</label>
                    <input type="text" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ''))} placeholder="32000" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-amber-500" required />
                  </div>
                  <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-sm shadow-md transition">Simpan Ke Database</button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2 overflow-x-auto">
                <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">📜 Daftar Stok Menu Live</h3>
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b text-slate-400 bg-slate-50/50">
                      <th className="p-3 font-semibold text-xs uppercase">Nama Menu</th>
                      <th className="p-3 font-semibold text-xs uppercase">Kategori</th>
                      <th className="p-3 font-semibold text-xs uppercase">Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuDatabase.length === 0 ? (
                      <tr><td colSpan={3} className="p-3 text-center text-slate-400 text-xs py-4">Belum ada data menu di database.</td></tr>
                    ) : (
                      menuDatabase.map((item, index) => (
                        <tr key={item._id || index} className="border-b hover:bg-slate-50/50">
                          <td className="p-3 font-medium text-slate-800">{item.title || item.nama}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md uppercase tracking-wider">{item.category || item.kategori}</span>
                          </td>
                          <td className="p-3 font-mono text-slate-600 font-semibold">Rp {Number(item.price || item.harga).toLocaleString('id-ID')}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB BARU: DATA LIVE RESERVASI (KASIR / BARISTA & OWNER) */}
          {activeTab === 'reservasi' && currentRole !== 'Stoker' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">🗓️ Jadwal Komitmen Meja Pelanggan</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Menampilkan seluruh data booking masuk dari sub-sistem pelanggan BrewedSpace.</p>
                </div>
                <button onClick={fetchBookingData} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">
                  🔄 Refresh Data
                </button>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b text-slate-400 bg-slate-50/50">
                    <th className="p-3 font-semibold uppercase">Nama Tamu</th>
                    <th className="p-3 font-semibold uppercase">Jumlah Orang</th>
                    <th className="p-3 font-semibold uppercase">Tanggal & Waktu</th>
                    <th className="p-3 font-semibold uppercase">Tujuan & Area</th>
                    <th className="p-3 font-semibold uppercase">Catatan Tambahan</th>
                    <th className="p-3 font-semibold uppercase">Status Meja</th>
                    <th className="p-3 font-semibold uppercase text-center">Aksi Kasir</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingsDatabase.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-3 text-center text-slate-400 text-xs py-8 italic">
                        Belum ada reservasi meja terdaftar di MongoDB hari ini.
                      </td>
                    </tr>
                  ) : (
                    bookingsDatabase.map((book: any, idx) => (
                      <tr key={book._id || idx} className="border-b hover:bg-slate-50/30">
                        <td className="p-3 font-bold text-slate-800">{book.name}</td>
                        <td className="p-3 font-semibold text-slate-600 font-mono">{book.guests} Pax</td>
                        <td className="p-3 text-slate-700 font-medium">
                          {book.date} <span className="text-amber-600 font-bold font-mono">({book.time || '12:00'})</span>
                        </td>
                        <td className="p-3">
                          <span className="block font-bold text-slate-700">{book.purpose}</span>
                          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-1 inline-block uppercase tracking-wide">
                            {book.specificArea}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 max-w-xs break-words">{book.notes || '-'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-black rounded-md uppercase tracking-wider border ${
                            book.status === 'confirmed' || book.status === 'success'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : book.status === 'cancelled'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {book.status || 'pending'}
                          </span>
                        </td>
                        <td className="p-3 text-center space-x-1.5 whitespace-nowrap">
                          {(!book.status || book.status === 'pending') && (
                            <>
                              <button 
                                onClick={() => handleUpdateBookingStatus(book._id, 'confirmed')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider transition shadow-sm"
                              >
                                Terima
                              </button>
                              <button 
                                onClick={() => handleUpdateBookingStatus(book._id, 'cancelled')}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider transition shadow-sm"
                              >
                                Tolak
                              </button>
                            </>
                          )}
                          {book.status === 'confirmed' && (
                            <span className="text-xs text-slate-400 font-medium italic">Sudah Disiapkan ✅</span>
                          )}
                          {book.status === 'cancelled' && (
                            <span className="text-xs text-red-400 font-medium italic">Dibatalkan ❌</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: LIHAT LAPORAN */}
          {activeTab === 'laporan' && currentRole !== 'Stoker' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Omset Live</p>
                    <p className="text-2xl font-black text-slate-800 mt-1 font-mono">Rp {totalOmset.toLocaleString('id-ID')}</p>
                    <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">📈 Akumulasi transaksi masuk</span>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">💰</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Transaksi</p>
                    <p className="text-2xl font-black text-slate-800 mt-1 font-mono">{totalTransaksi} Pesanan</p>
                    <span className="text-[11px] text-slate-400 mt-1 block">Rata-rata: Rp {rataRataBill.toLocaleString('id-ID')} / bill</span>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">☕</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Operasional</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">ONLINE</p>
                    <span className="text-[11px] text-amber-600 font-semibold mt-1 block">⚡ Sinkronisasi Cloud Aktif</span>
                  </div>
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl">📦</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-1">
                  <h3 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider">🔥 Produk Terlaris (Real-time)</h3>
                  <div className="space-y-4">
                    {topProducts.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Belum ada item yang terjual.</p>
                    ) : (
                      topProducts.map((prod, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                            <span>{index + 1}. {prod.title}</span>
                            <span>{prod.qty} Terjual</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${(prod.qty / maxQty) * 100}%` }}></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 overflow-x-auto">
                  <h3 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider">⏱️ Antrean & Riwayat Transaksi Live</h3>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b text-slate-400 bg-slate-50/50">
                        <th className="p-3 font-semibold uppercase">Pelanggan</th>
                        <th className="p-3 font-semibold uppercase">Item Pesanan</th>
                        <th className="p-3 font-semibold uppercase">Tipe/Meja</th>
                        <th className="p-3 font-semibold uppercase">Pembayaran</th>
                        <th className="p-3 font-semibold uppercase">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersDatabase.length === 0 ? (
                        <tr><td colSpan={5} className="p-3 text-center text-slate-400 text-xs py-4">Belum ada transaksi masuk dari Menu Page.</td></tr>
                      ) : (
                        ordersDatabase.map((order) => (
                          <tr key={order._id} className="border-b hover:bg-slate-50/30">
                            <td className="p-3 font-bold text-slate-800">
                              {order.customerName}
                              <span className="block font-normal text-[10px] text-slate-400 mt-0.5">
                                {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                              </span>
                            </td>
                            <td className="p-3 text-slate-600 font-medium">
                              {order.items?.map((item: any) => `${item.quantity}x ${item.title}`).join(', ')}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${order.orderType === 'Dine In' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                                {order.orderType} {order.tableNumber ? `(Meja ${order.tableNumber})` : ''}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                                order.paymentMethod?.toLowerCase() === 'qris' || order.metodePembayaran?.toLowerCase() === 'qris'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}>
                                💳 {order.paymentMethod || order.metodePembayaran || 'Tunai'}
                              </span>
                            </td>
                            <td className="p-3 font-mono font-bold text-slate-900 text-sm">Rp {order.total?.toLocaleString('id-ID')}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: IZIN AKUN BARU */}
          {activeTab === 'izin-akun' && currentRole === 'Owner' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
              <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wider">🛡️ Pembuatan Akun Staf Pegawai Kafe</h3>
              <p className="text-xs text-slate-400 mb-6">Gunakan form di bawah untuk mendaftarkan kredensial login akun Barista atau Stoker baru agar tercatat ke server database.</p>
              
              <form onSubmit={handleCreateStaffAccount} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username Pegawai</label>
                  <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Misal: barista_budi" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-amber-500" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Set Password Staf</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-amber-500" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Otoritas Kedudukan (Role)</label>
                  <select value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-amber-500 font-medium text-slate-700">
                    <option value="Barista">☕ Barista / Kasir</option>
                    <option value="Stoker">📦 Stoker / Logistik</option>
                  </select>
                </div>
                <button type="submit" className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-slate-800 transition">Generate Akun {newStaffRole} Baru</button>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}