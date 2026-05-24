"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import ini

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname(); // Ambil info path saat ini

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cek apakah kita sedang berada di halaman booking
  const isBookingPage = pathname === '/booking';

  return (
    <nav className={`fixed w-full z-[100] px-6 md:px-12 py-4 transition-all duration-500 ${
      isScrolled || isBookingPage
        ? "bg-[#1A120B]/90 backdrop-blur-md shadow-md py-3" 
        : "bg-transparent py-6"
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo - Otomatis jadi tombol kembali karena dibungkus Link ke "/" */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
            isScrolled || isBookingPage ? "bg-[#D5CEA3]" : "bg-white"
          }`}>
            <span className="text-[#1A120B] font-bold">B</span>
          </div>
          <span className={`text-2xl font-black tracking-tighter uppercase transition-colors duration-300 ${
            isScrolled || isBookingPage ? "text-white" : "text-white"
          }`}>
            Brewed.
          </span>
        </Link>
        
        {/* Menu Links */}
        <div className={`hidden md:flex items-center gap-10 font-black text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
          isScrolled || isBookingPage ? "text-white/80" : "text-white/90"
        }`}>
          <Link href="/" className="hover:text-[#D5CEA3] transition">Home</Link>
          <Link href="/menu" className="hover:text-[#D5CEA3] transition">Menu</Link>
          <Link href="/about" className="hover:text-[#D5CEA3] transition">Story</Link>
        </div>

        {/* LOGIKA KONDISIONAL: Sembunyikan tombol jika di halaman booking */}
        {!isBookingPage && (
          <Link href="/booking">
            <button className="px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 bg-[#D5CEA3] text-[#1A120B] shadow-2xl">
              Book a Table
            </button>
          </Link>
        )}

        {/* Opsional: Jika di halaman booking, beri ruang kosong atau teks tipis agar layout tetap seimbang */}
        {isBookingPage && <div className="w-[120px] hidden md:block"></div>}
      </div>
    </nav>
  );
}