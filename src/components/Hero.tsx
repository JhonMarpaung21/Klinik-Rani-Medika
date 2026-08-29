import React from "react";
import { ArrowRight, ShieldCheck, Heart, UserCheck, CalendarDays } from "lucide-react";

interface HeroProps {
  onNavigateToBooking: () => void;
  onNavigateToServices: () => void;
}

export default function Hero({ onNavigateToBooking, onNavigateToServices }: HeroProps) {
  return (
    <section id="beranda" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-br from-emerald-50 via-slate-50 to-white">
      {/* Background visual graphics */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl -z-10 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-100/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text section */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/75 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fasilitas Kesehatan Terakreditasi Paripurna</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 tracking-tight leading-none">
              Pelayanan Medis <span className="text-emerald-600">Terpercaya & Berhati Mulia</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={onNavigateToBooking}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-emerald-600/10 hover:shadow-emerald-600/25 transition-all transform active:scale-95 group cursor-pointer"
              >
                <CalendarDays className="w-5 h-5" />
                <span>Buat Janji Online</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onNavigateToServices}
                className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-emerald-600 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold px-8 py-4 rounded-2xl transition-all cursor-pointer"
              >
                <span>Lihat Layanan Kami</span>
              </button>
            </div>

            {/* Mini Trust Badges */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 w-full">
              <div>
                <p className="text-3xl font-bold text-slate-800">10k+</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Pasien Terlayani</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800">10+</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Dokter & Perawat</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800">4.9★</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Rating Google</p>
              </div>
            </div>
          </div>

          {/* Hero image and overlay section */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-square">
              {/* Outer decorative ring */}
              <div className="absolute -inset-4 bg-emerald-600/10 rounded-[3rem] transform -rotate-3 -z-10"></div>
              
              {/* Main image container */}
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600&h=600"
                  alt="Klinik Rani Medika Lobby"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating badges for extra polish */}
              <div className="absolute -left-6 bottom-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3 animate-bounce-slow">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Heart className="w-5 h-5 fill-emerald-500 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Pelayanan Tulus</h4>
                  <p className="text-[10px] text-slate-400">Sepenuh hati & ramah</p>
                </div>
              </div>

              <div className="absolute -right-4 top-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3 animate-float-slow">
                <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Dokter Spesialis</h4>
                  <p className="text-[10px] text-slate-400">Pendidikan Terkemuka</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
