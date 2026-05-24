"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import CSS Swiper dasar
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface MenuItem {
  _id: string;
  title: string;
  desc: string;
  price: number | string;
  img: string;
  category?: string;
}

export default function Features() {
  const [mounted, setMounted] = useState(false);
  const [shuffledMenu, setShuffledMenu] = useState<MenuItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // Mengambil data dari API backend untuk sinkronisasi
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/menus');
        // Acak dan potong 9 item
        const shuffled = [...response.data]
          .sort(() => 0.5 - Math.random())
          .slice(0, 9);
        setShuffledMenu(shuffled);
      } catch (error) {
        console.error("Gagal mengambil data menu:", error);
      }
    };
    fetchData();
  }, []);

  const handleNavigateToMenu = () => {
    router.push('/menu'); 
  };

  if (!mounted) return null;

  return (
    <>
    {/* SECTION: LAYANAN CAFE (8 KOTAK) */}
      <section className="py-20 bg-white px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "WiFi Kencang", desc: "Koneksi stabil dan cepat, cocok untuk WFH atau mabar tanpa lag.", icon: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.343 9.257c5.858-5.858 15.355-5.858 21.213 0" },
              { title: "Banyak Colokan", desc: "Tersedia stopkontak di setiap sudut meja, baterai aman seharian.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              { title: "Outdoor Area", desc: "Area terbuka yang luas untuk kamu yang ingin menikmati udara segar.", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { title: "Kopi Premium", desc: "Biji kopi pilihan yang diroasting dengan standar kualitas tinggi.", icon: "M16.72 11.06A5 5 0 0115 20H5a5 5 0 01-5-5V5a5 5 0 015-5h10a5 5 0 014.9 4H17a3 3 0 00-3 3v3.06z" },
              { title: "Meeting Room", desc: "Butuh privasi? Kami menyediakan ruang rapat dengan fasilitas lengkap.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
              { title: "Live Music", desc: "Nikmati penampilan akustik setiap akhir pekan biar makin asik nongkrongnya.", icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" },
              { title: "Parkir Luas", desc: "Area parkir aman dan lega untuk kendaraan roda dua maupun roda empat.", icon: "M5 10l7-7 7 7M4 14h16M17 14v6a1 1 0 01-1 1H8a1 1 0 01-1-1v-6" },
              { title: "Buka 24 Jam", desc: "Kami siap menemani lembur kamu kapanpun kamu butuh asupan kafein.", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map((box, index) => (
              <div key={index} className={`p-8 rounded-[32px] text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${index % 2 === 0 ? 'bg-[#F1F3E9]' : 'bg-white border border-[#F1F3E9]'}`}>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <svg className="w-6 h-6 text-[#2D5A27]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d={box.icon} /></svg>
                </div>
                <h4 className="text-[#1A120B] font-bold text-lg mb-3">{box.title}</h4>
                <p className="text-[#3C2A21]/60 text-xs leading-relaxed">{box.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: TODAY'S SPECIAL (Menu Slider) */}
      <section className="py-24 bg-white px-6 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#1A120B] mb-4 uppercase">Today's Special</h2>
            <div className="custom-pagination flex justify-center gap-2 mt-4 min-h-[12px]"></div>
          </div>

          <div className="relative group">
            <Swiper
              key={shuffledMenu.length}
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ el: '.custom-pagination', clickable: true, bulletClass: 'swiper-pagination-bullet', bulletActiveClass: 'swiper-pagination-bullet-active' }}
              navigation={{ nextEl: '.next-btn', prevEl: '.prev-btn' }}
              breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              className="pb-16"
            >
              {shuffledMenu.map((item, idx) => (
              <SwiperSlide key={item._id || idx}>
                <div className="group cursor-pointer">
                  <div className="relative h-72 w-full mb-6 overflow-hidden rounded-[32px] bg-gray-100 shadow-sm">
                    <img 
                      src={item.img.startsWith('http') ? item.img : `http://localhost:5000${item.img}`} 
                      alt={item.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A120B] mb-2">{item.title}</h3>
                  <p className="text-[#3C2A21]/60 text-sm leading-relaxed mb-4">{item.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-[#1A120B] text-lg">Rp {typeof item.price === 'number' ? item.price.toLocaleString() : item.price}</span>
                    <button onClick={handleNavigateToMenu} className="bg-[#E5E5CB] p-3 rounded-full hover:bg-[#D5CEA3] transition shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
              ))}
            </Swiper>
            <div className="absolute top-[40%] -translate-y-1/2 -left-4 z-10 hidden md:block"><button className="prev-btn bg-white shadow-2xl p-4 rounded-full text-[#1A120B] hover:bg-[#1A120B] hover:text-white transition-all border border-gray-50"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button></div>
            <div className="absolute top-[40%] -translate-y-1/2 -right-4 z-10 hidden md:block"><button className="next-btn bg-white shadow-2xl p-4 rounded-full text-[#1A120B] hover:bg-[#1A120B] hover:text-white transition-all border border-gray-50"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></button></div>
          </div>
        </div>
      </section>

      {/* SECTION 3: TENTANG KAMI */}
      <section className="py-20 bg-[#F1F3E9] px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <p className="text-[#1A120B]/60 text-sm mb-4 uppercase tracking-widest font-medium">Cerita Kami</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#1A120B] mb-6 leading-tight">Menciptakan Momen Berharga di Setiap Tegukan.</h2>
            <p className="text-[#3C2A21]/70 leading-relaxed mb-8 text-lg">Brewed Space lahir dari keinginan untuk menghadirkan ruang yang tidak hanya menyajikan kopi berkualitas, tapi juga kenyamanan untuk berkarya.</p>
            <Link href="/about"><button className="px-8 py-3 bg-white border border-[#1A120B] text-[#1A120B] font-bold rounded-full hover:bg-[#1A120B] hover:text-white transition-all shadow-sm">PELAJARI LEBIH LANJUT</button></Link>
          </div>
          <div className="flex-1 w-full"><div className="relative rounded-[40px] overflow-hidden shadow-2xl transform hover:rotate-2 transition-transform duration-500"><img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800" alt="Suasana Nyaman" className="w-full h-[450px] object-cover" /></div></div>
        </div>
      </section>
      
      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet { width: 10px !important; height: 10px !important; background-color: #D5CEA3 !important; opacity: 0.5; border-radius: 50% !important; cursor: pointer; transition: all 0.3s ease; margin: 0 4px !important; display: inline-block; }
        .custom-pagination .swiper-pagination-bullet-active { background-color: #1A120B !important; opacity: 1; transform: scale(1.3); }
      `}</style>
    </>
  );
}