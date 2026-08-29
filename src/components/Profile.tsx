import React from "react";
import { Award, Eye, HeartHandshake, CheckCircle2, Star, ShieldAlert } from "lucide-react";

export default function Profile() {
  const values = [
    {
      icon: <Award className="w-6 h-6 text-emerald-600" />,
      title: "Profesional & Ahli",
      desc: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-emerald-600" />,
      title: "Pelayanan Sepenuh Hati",
      desc: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." 
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      title: "Transparan & Terpercaya",
      desc: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
  ];

  return (
    <section id="profil" className="py-20 md:py-28 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-2">Profil Klinik</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Mengenal Lebih Dekat <span className="text-emerald-600">Klinik Rani Medika</span>
          </h2>
          <div className="w-16 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-slate-600 mt-4 text-sm md:text-base leading-relaxed">
            lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Content Block (Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800">Sejarah & Filosofi Kami</h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          {/* Vision and Mission boxes */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 flex gap-4 items-start hover:shadow-lg hover:shadow-slate-100 transition-all">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl shrink-0">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Visi Kami</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 flex gap-4 items-start hover:shadow-lg hover:shadow-slate-100 transition-all">
              <div className="p-3 bg-teal-100 text-teal-700 rounded-2xl shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Misi Kami</h4>
                <ul className="space-y-2.5 text-slate-600 text-sm leading-relaxed list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold mt-0.5">•</span>
                    <span>lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold mt-0.5">•</span>
                    <span>lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold mt-0.5">•</span>
                    <span>lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold mt-0.5">•</span>
                    <span>lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Values */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 text-center mb-10">Nilai Utama Pelayanan Kami</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <div key={idx} className="bg-white border border-slate-150 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-emerald-50 p-3 rounded-xl w-fit mb-5">
                  {val.icon}
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-2.5">{val.title}</h4>
                <p className="text-slate-600 text-xs leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
