import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brewed Space",
  description: "Artisanal coffee and gourmet snacks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#F9F9F2]`}
      >
        {/* Navbar akan muncul di semua halaman */}
        <Navbar />

        {/* flex-1 memastikan main mengisi ruang kosong agar footer terdorong ke bawah */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer akan muncul di semua halaman */}
        <Footer />
      </body>
    </html>
  );
}