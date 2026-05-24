"use client";
import React from 'react';
// Perbaikan path: naik 2 tingkat (dari folder 'about' ke 'app', lalu ke 'src')
import Navbar from '../../components/Navbar'; 
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F9F9F2] text-[#1A120B] overflow-x-hidden">
      <Navbar />

      {/* --- SECTION 1: HERO ABOUT --- */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">
              Since 2024
            </span>
          </div>
          <h1 className="text-7xl md:text-[120px] font-black italic uppercase leading-[0.8] tracking-[-0.05em] mb-10">
            Our <br /> 
            <span className="text-transparent stroke-text opacity-90">Story</span>
            <span className="text-orange-500 not-italic">.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base font-bold opacity-60 leading-relaxed uppercase tracking-widest mb-10">
            Lebih dari sekadar tempat ngopi, Brewed Space adalah wadah bagi para kreator, 
            pemimpi, dan pencari inspirasi di tengah hiruk pikuk kota Depok.
          </p>

          {/* Tombol Kembali ke Home (Opsi 1: Di Atas) */}
          <Link href="/">
            <button className="flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-[0.3em] hover:text-orange-600 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
              Back to Home
            </button>
          </Link>
        </div>
      </section>

      {/* --- SECTION 2: THE VISION --- */}
      <section className="py-24 px-6 bg-white rounded-[60px] md:rounded-[100px] shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl transition-all duration-500 group-hover:rounded-[20px]">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800" 
                alt="Brewed Space Atmosphere" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-[#1A120B] text-white p-8 rounded-full w-40 h-40 flex flex-col items-center text-center justify-center font-black rotate-12 shadow-2xl border-4 border-white">
              <span className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Authentic</span>
              <span className="text-xl leading-none">BREWED</span>
              <span className="text-orange-500 text-2xl">SPACE</span>
            </div>
          </div>

          <div className="space-y-8 md:pl-8">
            <h2 className="text-5xl md:text-6xl font-black leading-[0.9] tracking-tighter uppercase italic">
              Menciptakan Momen Berharga di Setiap <span className="text-orange-600">Tegukan.</span>
            </h2>
            <div className="space-y-6 text-sm md:text-base font-medium opacity-70 leading-relaxed">
              <p>
                Brewed Space lahir dari keinginan untuk menghadirkan ruang yang tidak hanya menyajikan kopi berkualitas, tapi juga kenyamanan berkarya.
              </p>
              <p>
                Kami percaya bahwa setiap cangkir memiliki cerita, dan setiap sudut ruangan kami dirancang untuk mendukung setiap inspirasi Anda.
              </p>
            </div>
            
            <div className="pt-6">
               <Link href="/menu">
                <button className="px-10 py-4 bg-[#1A120B] text-white font-black rounded-full hover:bg-orange-600 transition-all shadow-xl uppercase tracking-widest text-[10px] active:scale-95">
                  Explore Our Menu
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: VALUES --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "☕", title: "Artisanal Coffee", desc: "Biji kopi pilihan yang dipanggang dengan presisi untuk rasa maksimal." },
              { icon: "✨", title: "Inspiring Space", desc: "Suasana tenang dan estetik yang dirancang untuk produktivitas Anda." },
              { icon: "🤝", title: "Community First", desc: "Menjadi rumah bagi komunitas kreatif untuk berbagi ide." }
            ].map((value, idx) => (
              <div key={idx} className="p-10 bg-white border border-gray-100 rounded-[40px] hover:shadow-2xl transition-all group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform inline-block">{value.icon}</div>
                <h4 className="font-black uppercase tracking-tight text-xl mb-3">{value.title}</h4>
                <p className="text-xs font-bold opacity-40 leading-relaxed uppercase tracking-widest">{value.desc}</p>
              </div>
            ))}
          </div>

          {/* Tombol Kembali ke Home (Opsi 2: Di Bawah/Footer) */}
          <div className="mt-24 text-center">
             <Link href="/">
                <button className="px-12 py-5 border-2 border-[#1A120B] text-[#1A120B] font-black rounded-full hover:bg-[#1A120B] hover:text-white transition-all uppercase tracking-[0.3em] text-[10px]">
                  Return to Home
                </button>
             </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 2px #1A120B;
        }
      `}</style>
    </main>
  );
}