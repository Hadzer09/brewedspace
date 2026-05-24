"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Features from '../components/Features';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenLoading = sessionStorage.getItem('hasSeenBrewedLoading');

    if (hasSeenLoading) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('hasSeenBrewedLoading', 'true');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Pastikan scroll terkunci total saat loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh'; // Tambahan agar benar-benar kaku
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'auto';
    }
  }, [isLoading]);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen bg-[#E5E5CB] overflow-x-hidden">
      
      {/* LAYER LOADING: 
          Kita pakai z-[999] supaya benar-benar di atas segalanya (termasuk Navbar).
          Pointer-events-none penting supaya setelah hilang, user bisa klik tombol di bawahnya.
      */}
      <div 
        className={`fixed inset-0 z-[999] bg-[#1A120B] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
          isLoading ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className={`text-center transition-transform duration-1000 ease-out ${isLoading ? 'scale-100' : 'scale-110'}`}>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter text-[#D5CEA3] mb-6">
            Brewed<span className="text-white">.</span>
          </h1>
          <div className="w-40 h-[1px] bg-white/10 mx-auto relative overflow-hidden">
            <div className={`absolute inset-0 bg-[#D5CEA3] ${isLoading ? 'animate-progress-line' : 'w-full'}`}></div>
          </div>
          <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">
            Artisanal Experience
          </p>
        </div>
      </div>

      {/* KONTEN DI BAWAH LOADING 
          Semua ini akan dirender, tapi tidak akan terlihat karena tertutup div di atas.
      */}
      <Navbar />
      
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1920" 
            alt="Coffee Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 pt-20 px-12 flex flex-col items-center justify-center text-center max-w-7xl mx-auto">
          <h1 className="text-7xl md:text-9xl font-black text-white leading-none tracking-tighter drop-shadow-2xl">
            Brewed <br /> 
            <span className="text-[#D5CEA3]">Space.</span>
          </h1>
          
          <p className="text-white/90 mt-6 text-xl font-medium max-w-lg">
            Tempat ternyaman di Depok untuk ngopi dan cari inspirasi. ☕
          </p>
          
          <Link href="/menu"> 
            <button className="mt-10 bg-[#D5CEA3] text-[#1A120B] hover:bg-white px-10 py-4 rounded-2xl font-black shadow-2xl transition-all">
              Cek Menu
            </button>
          </Link>
        </div>
      </section>

      <div className="relative z-20 bg-white">
        <Features />
      </div>

      <style jsx>{`
        @keyframes progress-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress-line {
          animation: progress-line 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
      `}</style>
    </main>
  );
}