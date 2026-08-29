import React from "react";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const links = [
    { id: "beranda", label: "Beranda" },
    { id: "profil", label: "Profil Klinik" },
    { id: "layanan", label: "Layanan Medis" },
    { id: "dokter", label: "Jadwal Dokter" },
    { id: "alamat", label: "Lokasi & Alamat" },
    { id: "ulasan", label: "Ulasan Google" },
    { id: "kontak", label: "Buat Janji Online" }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-12">
        
        {/* Col 1: Brand & Desc (4 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate("beranda")}>
            <img
              src={`${import.meta.env.BASE_URL}images/logo.png`}
              alt="Logo Klinik Rani Medika"
               className="h-10 w-auto"
            />
            <div>
              <h2 className="text-lg font-extrabold text-white leading-none tracking-tight">
                Klinik Rani Medika
              </h2>
            </div>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
            Klinik Rani Medika melayani kesehatan dengan penuh keahlian, ketulusan, dan keramahan. Menyediakan layanan kesehatan terpadu dan profesional yang dekat di hati masyarakat.
          </p>

          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-xl transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-xl transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-xl transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Navigation Links (3 cols) */}
        <div className="md:col-span-3">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-6 border-l-2 border-emerald-500 pl-2.5">
            Navigasi Cepat
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm">
            {links.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => onNavigate(link.id)}
                  className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Quick Contacts info (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-6 border-l-2 border-emerald-500 pl-2.5">
            Hubungi Kami
          </h3>
          
          <div className="space-y-4 text-xs sm:text-sm text-slate-400">
            <div className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Jl. Tegal Binangun, Plaju Darat, Kec. Plaju, Kota Palembang, Sumatera Selatan 30267</span>
            </div>

            <div className="flex gap-3 items-center">
              <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
              <a href="tel:0211234567" className="hover:text-emerald-400">+62 852-4976-9327   </a>
            </div>

            <div className="flex gap-3 items-center">
              <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
              <a href="mailto:raniapriliadl@gmail.com" className="hover:text-emerald-400">raniapriliadl@gmail.com</a>
            </div>
          </div>
        </div>

      </div>

      {/* Footer base bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {currentYear} Klinik Rani Medika. Seluruh Hak Cipta Dilindungi.</p>
        <p className="font-semibold text-slate-400">
          React & Tailwind
        </p>
      </div>
    </footer>
  );
}
