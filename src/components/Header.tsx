import React, { useState, useEffect } from "react";
import { Phone, Clock, Menu, X } from "lucide-react";

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function Header({ activeSection, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { id: "beranda", label: "Beranda" },
    { id: "profil", label: "Profil" },
    { id: "layanan", label: "Layanan" },
    { id: "dokter", label: "Dokter" },
    { id: "alamat", label: "Alamat & Jam" },
    { id: "ulasan", label: "Ulasan" },
    { id: "kontak", label: "Hubungi Kami" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      {/* Top bar with quick info */}
      <div className="bg-emerald-800 text-emerald-50 text-xs py-2 px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-300" />
            <span className="font-semibold">Layanan Darurat:</span>
            <a href="tel:0211234567" className="hover:underline">+62 852-4976-9327</a>
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-300" />
            <span>Senin - Sabtu: 08:00 - 21:00</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/6285249769327"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white font-medium transition-colors"
          >
            WhatsApp Kami
          </a>
        </div>
      </div>

      {/* Main navigation bar */}
      <nav
        className={`w-full py-4 px-4 sm:px-6 md:px-8 flex justify-between items-center transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-md border-b border-slate-100"
            : "bg-white/95 backdrop-blur-md md:bg-transparent"
        }`}
      >
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => handleNavClick("beranda")}
          >
            <img
              src={`${import.meta.env.BASE_URL}images/logo.png`}
              alt="Logo Klinik Rani Medika"
              className="h-10 w-auto transition-transform group-hover:scale-105"
            />
            <div>
    <         h1 className="text-lg font-bold text-slate-800 leading-none tracking-tight">
                Klinik Rani Medika
              </h1>
            </div>
          </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSection === item.id
                  ? "text-emerald-700 bg-emerald-50/80"
                  : isScrolled
                  ? "text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                  : "text-slate-700 hover:text-emerald-700 hover:bg-white/80"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("kontak")}
            className="ml-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.98] transition-all"
          >
            Daftar Online
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-slate-700 hover:text-emerald-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[108px] sm:top-[76px] bg-white z-40 border-t border-slate-100 flex flex-col p-6 animate-fade-in">
          <div className="flex flex-col gap-2 mb-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full py-3 px-4 rounded-xl text-left font-medium transition-all ${
                  activeSection === item.id
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-4">
            <button
              onClick={() => handleNavClick("kontak")}
              className="w-full bg-emerald-600 text-white font-semibold py-3.5 rounded-xl shadow-lg text-center"
            >
              Buat Janji Temu Online
            </button>
            <div className="text-center text-slate-500 text-xs">
              Hubungi Kami: <span className="font-semibold text-slate-700">021-123-4567</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
