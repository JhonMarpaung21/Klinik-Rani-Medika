import React, { useState, useEffect } from "react";
import { Doctor } from "../types";
import { Star, Clock, GraduationCap, Calendar, Check, AlertTriangle, MessageSquare } from "lucide-react";

interface DoctorsProps {
  onSelectDoctorToBook: (doctorId: string) => void;
}

export default function Doctors({ onSelectDoctorToBook }: DoctorsProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState("Semua");

  const specialties = [
    "Semua",
    "Penyakit Dalam",
    "Dokter Umum",
    "Gigi",
    "Anak"
  ];

  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data dokter");
        return res.json();
      })
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching doctors:", err);
        // Fallback static data if api fails
        const fallback: Doctor[] = [
          {
            id: "dr-rani",
            name: "dr. abal, Sp.PD",
            role: "Spesialis Penyakit Dalam",
            experience: "12 Tahun Pengalaman",
            education: "S1 & Spesialis Kedokteran Universitas Indonesia (UI)",
            schedule: "Senin - Kamis (08.00 - 13.00), Sabtu (09.00 - 12.00)",
            status: "Aktif",
            rating: 4.9,
            reviewsCount: 142,
            image: ""
          },
          {
            id: "dr-budi",
            name: "dr. Budi Santoso, GP",
            role: "Dokter Umum",
            experience: "8 Tahun Pengalaman",
            education: "Kedokteran Universitas Gadjah Mada (UGM)",
            schedule: "Senin - Sabtu (13.00 - 17.00 & 18.30 - 21.00)",
            status: "Aktif",
            rating: 4.8,
            reviewsCount: 95,
            image: ""
          },
          {
            id: "drg-rani",
            name: "drg. Rani Aprilia Dilaga",
            role: "Spesialis Kesehatan Gigi",
            experience: "5 Tahun Pengalaman",
            education: "Kedokteran Gigi Universitas Sriwijaya (Unsri)",
            schedule: "Selasa, Rabu, Kamis (14.00 - 19.00)",
            status: "Aktif",
            rating: 4.5,
            reviewsCount: 88,
            image: "/images/foto_rani.png"
          }
        ];
        setDoctors(fallback);
        setLoading(false);
      });
  }, []);

  const filteredDoctors = selectedSpecialty === "Semua"
    ? doctors
    : doctors.filter(doc => doc.role.toLowerCase().includes(selectedSpecialty.toLowerCase()));

  return (
    <section id="dokter" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-2">Dokter Spesialis & Umum</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Tim Medis <span className="text-emerald-600">Terbaik & Profesional</span>
          </h2>
          <div className="w-16 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-slate-600 mt-4 text-sm md:text-base leading-relaxed">
            Kenali dokter-dokter kami yang mendedikasikan waktu, pengetahuan, dan keahlian mereka demi menjamin kesembuhan dan kenyamanan pemulihan Anda.
          </p>
        </div>

        {/* Filter Specialty Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedSpecialty === spec
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/15"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100"
              }`}
            >
              {spec === "Semua" ? "Semua Dokter" : spec}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl border border-slate-150 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                {/* Image & Status Area */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        doc.status === "Aktif"
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10"
                          : "bg-amber-500 text-white shadow-md shadow-amber-500/10"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl shadow-md flex items-center gap-1.5 border border-white/40">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-800">{doc.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-400 font-medium">({doc.reviewsCount} ulasan)</span>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
                      {doc.role}
                    </p>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-tight mb-2">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mb-4">
                      {doc.experience}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                      <div className="flex items-start gap-2.5">
                        <GraduationCap className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-slate-400 font-medium uppercase tracking-wider text-[9px]">Pendidikan</p>
                          <p className="text-slate-600 font-medium leading-relaxed">{doc.education}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-slate-400 font-medium uppercase tracking-wider text-[9px]">Jadwal Praktik</p>
                          <p className="text-slate-600 font-medium leading-relaxed">{doc.schedule}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                    {doc.status === "Aktif" ? (
                      <button
                        onClick={() => onSelectDoctorToBook(doc.id)}
                        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-3 rounded-xl transition-all cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Buat Janji</span>
                      </button>
                    ) : (
                      <div className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-400 font-semibold text-xs py-3 rounded-xl">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Sedang Cuti / Libur</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
