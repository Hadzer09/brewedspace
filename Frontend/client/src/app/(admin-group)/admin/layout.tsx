import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 overflow-hidden w-full">
      {/* Sisi Sidebar statis dipindahkan/dihapus dari sini karena page.tsx 
        sudah memiliki Sidebar Dinamis (Owner, Barista, Stoker) yang terintegrasi 
        dengan sistem login Express + MongoDB kamu.
      */}

      {/* AREA KONTEN UTAMA */}
      <div className="flex-1 flex flex-col overflow-hidden h-full w-full">
        
        {/* Tempat halaman isi page.tsx (Dashboard + Sidebar Dinamis) akan muncul */}
        <main className="flex-1 overflow-hidden bg-slate-50 h-full w-full">
          {children}
        </main>
        
      </div>
    </div>
  );
}