// components/Footer.tsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#2D5A27] py-8 px-6 text-center text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-6 opacity-80 text-sm">
          <span>© 2026 Brewed Space</span>
          <span>•</span>
          <span>brewedspace@gmail.com</span>
          <span>•</span>
          <span>@brewed.space</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;