"use client";
import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import Navbar from '../../components/Navbar'; 

export default function MenuPage() {
  const [mounted, setMounted] = useState(false);
  const [MENU_DATA, setMENU_DATA] = useState<any[]>([]); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Semua");
  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState("Dine In");
  const [tableNumber, setTableNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // State loading saat checkout

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/menus');
        setMENU_DATA(response.data);
      } catch (error) {
        console.error("Gagal mengambil data dari database:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (item: any) => {
    const existingItem = cartItems.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      setCartItems(cartItems.map((cartItem) =>
        cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const decreaseQuantity = (id: string) => {
    setCartItems(cartItems.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity - 1 } : item
    ).filter((item) => item.quantity > 0));
  };

  const subtotal = cartItems.reduce((acc, curr) => acc + (Number(curr.price) * curr.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // FUNGSI UNTUK CHECKOUT KE DATABASE
  const handleCheckout = async () => {
    if (cartItems.length === 0 || !customerName || (orderType === "Dine In" && !tableNumber)) return;

    setIsSubmitting(true);
    const orderPayload = {
      customerName,
      orderType,
      tableNumber: orderType === "Dine In" ? tableNumber : null,
      items: cartItems.map(item => ({
        menuId: item._id,
        title: item.title,
        price: Number(item.price),
        quantity: item.quantity
      })),
      subtotal,
      tax,
      total,
      status: "Pending" // Status awal pesanan untuk dibaca Admin Panel
    };

    try {
      const response = await axios.post('http://localhost:5000/api/orders', orderPayload);
      if (response.status === 201 || response.status === 200) {
        alert("Pesanan berhasil dibuat!");
        // Reset form & keranjang belanja setelah sukses
        setCartItems([]);
        setCustomerName("");
        setTableNumber("");
        setIsCartOpen(false);
      }
    } catch (error) {
      console.error("Gagal mengirim pesanan:", error);
      alert("Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMenu = activeTab === "Semua" 
    ? MENU_DATA 
    : MENU_DATA.filter(item => item.category === activeTab);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-[#F9F9F2] overflow-x-hidden font-sans text-[#1A120B]">
      <Navbar />

      {/* Floating Cart Button */}
      <div className="fixed top-24 right-6 z-50">
        <button 
          onClick={toggleCart}
          className="bg-[#1A120B] text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform relative"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Side Cart Drawer */}
      {isCartOpen && <div className="fixed inset-0 bg-black/40 z-[100]" onClick={toggleCart} />}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[110] shadow-2xl transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black italic uppercase tracking-tight">Order Details</h2>
            <button onClick={toggleCart} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Customer Name</label>
              <input 
                type="text" 
                placeholder="Input name here..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-gray-50 border-b-2 border-gray-100 py-2 px-1 focus:border-[#1A120B] outline-none transition-colors font-medium text-sm"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Order Type</label>
                <select 
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="w-full bg-gray-50 border-b-2 border-gray-100 py-2 px-1 focus:border-[#1A120B] outline-none transition-colors font-medium text-sm"
                >
                  <option value="Dine In">Dine In</option>
                  <option value="Take Away">Take Away</option>
                </select>
              </div>
              {orderType === "Dine In" && (
                <div className="w-1/3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Table No.</label>
                  <input 
                    type="number" 
                    placeholder="00"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-gray-50 border-b-2 border-gray-100 py-2 px-1 focus:border-[#1A120B] outline-none transition-colors font-medium text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 opacity-30 italic text-sm">Cart is empty.</div>
            ) : (
              cartItems.map((item) => (
                <div key={item._id} className="flex gap-4 group">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden">
                    <img src={item.img.startsWith('http') ? item.img : `http://localhost:5000${item.img}`} className="w-full h-full object-cover" alt={item.title} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                    <div className="flex items-center gap-3">
                        <button onClick={() => decreaseQuantity(item._id)} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs hover:bg-[#1A120B] hover:text-white transition-colors">-</button>
                        <span className="text-xs font-black">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs hover:bg-[#1A120B] hover:text-white transition-colors">+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* BOLD HARGA DI CART */}
                    <p className="font-black text-sm text-[#1A120B]">Rp {(Number(item.price) * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t-2 border-dashed border-gray-100 pt-6 mt-4 space-y-2">
            <div className="flex justify-between text-xs opacity-60 font-bold"><span>Subtotal</span><span>Rp {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-xs opacity-60 font-bold"><span>Tax (10%)</span><span>Rp {tax.toLocaleString()}</span></div>
            <div className="flex justify-between pt-4"><span className="font-black uppercase tracking-tighter">Total Amount</span><span className="font-black text-2xl text-[#1A120B]">Rp {total.toLocaleString()}</span></div>
            
            {/* PANGGIL FUNGSI ONCLICK CHECKOUT */}
            <button 
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || !customerName || (orderType === "Dine In" && !tableNumber) || isSubmitting} 
              className="w-full bg-[#1A120B] disabled:bg-gray-200 text-white py-5 rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all mt-4"
            >
              {isSubmitting ? "Processing..." : "Confirm Checkout"}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <section className="max-w-6xl mx-auto pt-32 px-6 pb-20">
        <div className="mb-20 relative">
          <div className="relative inline-block">
            <h1 className="text-7xl md:text-[120px] font-black italic uppercase leading-[0.8] tracking-[-0.05em] text-[#0F0A07]">Brewed</h1>
            <h1 className="text-7xl md:text-[120px] font-black italic uppercase leading-[0.8] tracking-[-0.05em] text-transparent stroke-text opacity-90 mt-[-5px] md:mt-[-15px]">Space<span className="text-orange-500 not-italic">.</span></h1>
            <div className="absolute -top-4 -right-12 hidden md:block"><span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest rotate-12 inline-block shadow-lg">Premium Quality</span></div>
          </div>
          <p className="mt-8 text-sm md:text-base max-w-md font-bold opacity-60 leading-relaxed uppercase tracking-widest text-[#1A120B]">A curated selection of artisanal coffee and gourmet snacks for your daily ritual.</p>
        </div>

        <div className="flex gap-2 mb-16 overflow-x-auto pb-4 no-scrollbar border-b border-gray-200/50">
          {["Semua", "Bakery", "Makanan", "Minuman", "Sweets", "Sides"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === tab ? "bg-[#1A120B] text-[#F9F9F2]" : "text-gray-300 hover:text-[#1A120B]"}`}>{tab}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
          {filteredMenu.map((item) => (
            <div key={item._id} className="group">
              <div className="relative aspect-[4/5] w-full mb-6 overflow-hidden rounded-[40px] bg-white shadow-sm border border-gray-100 transition-all duration-500 group-hover:rounded-[20px] group-hover:shadow-2xl">
                <img src={item.img.startsWith('http') ? item.img : `http://localhost:5000${item.img}`} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute bottom-6 left-6 right-6">
                   <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl flex justify-between items-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="font-black text-xs uppercase tracking-tighter">Quick Add</span>
                      <button onClick={() => addToCart(item)} className="bg-[#1A120B] text-white p-2 rounded-full hover:bg-orange-500 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg></button>
                   </div>
                </div>
              </div>
              <div className="px-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-black uppercase tracking-tight leading-none">{item.title}</h3>
                </div>
                {item.desc && (
                  <p className="text-xs text-gray-500 font-medium normal-case mb-2 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                )}
                {/* BOLD HARGA DI HALAMAN UTAMA */}
                <p className="text-xs font-black uppercase tracking-wider text-[#1A120B] mt-1">
                  Rp {Number(item.price).toLocaleString()} 
                  <span className="text-[10px] font-bold opacity-30 normal-case ml-2">• {item.category}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .stroke-text { -webkit-text-stroke: 2px #1A120B; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}