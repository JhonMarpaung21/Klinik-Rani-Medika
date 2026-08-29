import React from "react";
import { MapPin, Phone, MessageCircle, Mail, Clock, HelpCircle, Navigation, ExternalLink } from "lucide-react";

export default function Address() {
  const contacts = [
    {
      icon: <MapPin className="w-5 h-5 text-emerald-600" />,
      title: "Alamat Utama",
      content: "Jl. Tegal Binangun, Plaju Darat, Kec. Plaju, Kota Palembang, Sumatera Selatan 30267"
    },
    {
      icon: <Phone className="w-5 h-5 text-emerald-600" />,
      title: "Telepon & UGD",
      content: " 0823-7960-5588"
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-emerald-600" />,
      title: "WhatsApp",
      content: "0812-3456-7890 (Chat Saja)"
    },
    {
      icon: <Mail className="w-5 h-5 text-emerald-600" />,
      title: "Email",
      content: "lorem ipsum dolor sit amet"
    }
  ];

  const operationalHours = [
    { day: "Senin", hours: "08:00 - 19:30" },
    { day: "Selasa", hours: "08:00 - 19:30",},
    { day: "Rabu", hours: "08:00 - 19:30",},
    { day: "Kamis", hours: "08:00 - 19:30",},
    { day: "Jumat", hours: "08:00 - 19:30",},
    { day: "Sabtu", hours: "08:00 - 19:30",},
    { day: "Minggu & Hari Libur", hours: "Tutup",}
  ];

  return (
    <section id="alamat" className="py-20 md:py-28 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-2">Kontak & Lokasi</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Lokasi Strategis & <span className="text-emerald-600">Jam Operasional</span>
          </h2>
          <div className="w-16 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-slate-600 mt-4 text-sm md:text-base leading-relaxed">
            Klinik kami berada di pusat kota dengan akses transportasi publik yang mudah. Lihat panduan rute dan jadwal pelayanan operasional medis kami di bawah ini.
          </p>
        </div>

        {/* Grid: Details vs Maps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Column Left: Contact Details & Hours (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contacts.map((c, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex gap-3.5 hover:shadow-md hover:shadow-slate-100 transition-shadow">
                  <div className="p-3 bg-emerald-100/75 rounded-xl text-emerald-700 shrink-0 h-fit">
                    {c.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">{c.title}</h4>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Operating Hours Block */}
            <div className="bg-slate-50 border border-slate-100 p-6 sm:p-8 rounded-3xl">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Jadwal Operasional Klinik</span>
              </h3>
              
              <div className="space-y-3.5">
                {operationalHours.map((oh, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-slate-100 last:border-0"
                  >
                    <span className="text-sm font-bold text-slate-700">{oh.day}</span>
                    <div className="flex flex-col sm:items-end mt-1 sm:mt-0">
                      <span className={`text-sm font-bold ${oh.hours === "Tutup" ? "text-rose-500" : "text-emerald-700"}`}>
                        {oh.hours}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{oh.note}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Column Right: Custom Styled Map Area (5 cols on lg) */}
          <div className="lg:col-span-5 h-full flex flex-col justify-between">
            <div className="bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden shadow-sm p-4 h-full flex flex-col justify-between min-h-[400px]">
              
              {/* Custom SVG Styled Map Visual Block */}
              <div className="relative bg-emerald-50 w-full h-[320px] rounded-2xl overflow-hidden border border-slate-150 shadow-inner flex flex-col items-center justify-center">
                
                {/* SVG Maps Road Lines for authentic design */}
                <svg className="absolute inset-0 w-full h-full text-slate-300 opacity-60" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="50" x2="500" y2="50" stroke="currentColor" strokeWidth="8" />
                  <line x1="120" y1="0" x2="120" y2="400" stroke="currentColor" strokeWidth="12" />
                  <line x1="0" y1="200" x2="500" y2="280" stroke="currentColor" strokeWidth="16" />
                  <line x1="320" y1="0" x2="320" y2="400" stroke="currentColor" strokeWidth="8" />
                </svg>

                {/* Neighbor landmarks representation */}
                <div className="absolute top-10 left-4 bg-white/80 backdrop-blur px-2.5 py-1 rounded shadow text-[9px] font-bold text-slate-400">
                  Kawasan Plaju Darat
                </div>
                <div className="absolute bottom-16 right-8 bg-white/80 backdrop-blur px-2.5 py-1 rounded shadow text-[9px] font-bold text-slate-400">
                  Jalan Tegal Binangun
                </div>
                

                {/* Primary Clinic Pin */}
                <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce-slow">
                  <div className="bg-rose-500 text-white p-2.5 rounded-full shadow-lg shadow-rose-500/30 border-2 border-white">
                    <MapPin className="w-6 h-6 fill-rose-100" />
                  </div>
                  <div className="bg-slate-800 text-white font-bold text-[10px] px-2.5 py-1 rounded-md shadow-md mt-2 whitespace-nowrap border border-slate-700">
                    Klinik Rani Medika
                  </div>
                </div>

                {/* Map Scale or Compass overlay */}
              </div>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded shadow text-[9px] text-slate-500 font-mono"> 
              Kota Palembang, Sumsel
              </div>

              {/* Map Actions */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full">
                <a
                  href="https://www.google.com/maps/place/KLINIK+RANI+MEDIKA/@-3.0237822,104.8024088,17z/data=!3m1!4b1!4m6!3m5!1s0x2e3b9d007f8ee98b:0x5205f7b292d3ab1e!8m2!3d-3.0237822!4d104.8049837!16s%2Fg%2F11ld950wwv?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-3.5 rounded-xl transition-colors text-center shadow-md cursor-pointer"
                >
                  <Navigation className="w-4 h-4 fill-white" />
                  <span>Petunjuk Rute Navigasi</span>
                </a>
                <a
                  href="https://www.google.com/maps/place/KLINIK+RANI+MEDIKA/@-3.0237822,104.8024088,17z/data=!3m1!4b1!4m6!3m5!1s0x2e3b9d007f8ee98b:0x5205f7b292d3ab1e!8m2!3d-3.0237822!4d104.8049837!16s%2Fg%2F11ld950wwv?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs py-3.5 px-4 rounded-xl transition-colors"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
