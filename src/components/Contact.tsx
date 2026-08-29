import React, { useState, useEffect } from "react";
import { Doctor } from "../types";
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle2, RefreshCw, Send, HelpCircle } from "lucide-react";

interface ContactProps {
  selectedDoctorId: string;
  onClearSelectedDoctor: () => void;
}

export default function Contact({ selectedDoctorId, onClearSelectedDoctor }: ContactProps) {
  // Database state
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states - Appointment
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Form states - Contact Message
  const [msgName, setMsgName] = useState("");
  const [msgEmail, setMsgEmail] = useState("");
  const [msgPhone, setMsgPhone] = useState("");
  const [msgText, setMsgText] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");

  // Active Tab: Booking / Inquiry
  const [activeFormTab, setActiveFormTab] = useState<"booking" | "inquiry">("booking");

  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil dokter");
        return res.json();
      })
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading doctors in Contact:", err);
        setLoading(false);
      });
  }, []);

  // Pre-select doctor if selectedDoctorId is passed from parent
  useEffect(() => {
    if (selectedDoctorId && doctors.some(d => d.id === selectedDoctorId)) {
      setDoctorId(selectedDoctorId);
      setActiveFormTab("booking");
    }
  }, [selectedDoctorId, doctors]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");
    
    if (!patientName.trim() || !phone.trim() || !doctorId || !date || !time) {
      setBookingError("Harap isi semua kolom berwajib.");
      return;
    }

    setBookingLoading(true);

    fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientName, phone, email, doctorId, date, time, notes }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mendaftarkan janji temu");
        return res.json();
      })
      .then((data) => {
        setBookingSuccess(data.appointment);
        // Clear fields
        setPatientName("");
        setPhone("");
        setEmail("");
        setDoctorId("");
        setDate("");
        setTime("");
        setNotes("");
        onClearSelectedDoctor();
      })
      .catch((err) => {
        console.error("Error booking appointment:", err);
        setBookingError("Gagal mengirim data. Silakan periksa koneksi internet Anda.");
      })
      .finally(() => {
        setBookingLoading(false);
      });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError("");

    if (!msgName.trim() || !msgPhone.trim() || !msgText.trim()) {
      setContactError("Harap lengkapi Nama, Telepon, dan Isi Pesan.");
      return;
    }

    setContactLoading(true);

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: msgName, email: msgEmail, phone: msgPhone, message: msgText }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengirim pesan");
        return res.json();
      })
      .then((data) => {
        setContactSuccess(true);
        setMsgName("");
        setMsgEmail("");
        setMsgPhone("");
        setMsgText("");
      })
      .catch((err) => {
        console.error("Error sending message:", err);
        setContactError("Pesan gagal terkirim. Silakan coba kembali.");
      })
      .finally(() => {
        setContactLoading(false);
      });
  };

  // Preset time slots
  const timeSlots = [
    "08:30 - 09:30",
    "09:30 - 10:30",
    "10:30 - 11:30",
    "13:30 - 14:30",
    "14:30 - 15:30",
    "15:30 - 16:30",
    "19:00 - 20:00",
    "20:00 - 21:00"
  ];

  return (
    <section id="kontak" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-2">Pendaftaran & Hubungi Kami</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Konsultasikan Kesehatan <span className="text-emerald-600">Keluarga Anda</span>
          </h2>
          <div className="w-16 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-slate-600 mt-4 text-sm md:text-base leading-relaxed">
            Daftar online tanpa antre untuk janji temu dokter atau kirimkan pertanyaan seputar layanan kesehatan kami secara langsung.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-50 border border-slate-150 p-1 rounded-2xl flex gap-1">
            <button
              onClick={() => {
                setActiveFormTab("booking");
                setBookingSuccess(null);
              }}
              className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeFormTab === "booking"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Daftar Janji Temu Dokter
            </button>
            <button
              onClick={() => {
                setActiveFormTab("inquiry");
                setContactSuccess(false);
              }}
              className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeFormTab === "inquiry"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Hubungi Kami / Tanya Layanan
            </button>
          </div>
        </div>

        {/* Form Body Container */}
        <div className="max-w-3xl mx-auto">
          {activeFormTab === "booking" ? (
            /* APPOINTMENT FORM */
            bookingSuccess ? (
              /* Success Ticket Receipt */
              <div className="bg-emerald-50 border-2 border-emerald-500/20 rounded-3xl p-6 sm:p-10 text-center animate-scale-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-1">Pendaftaran Berhasil!</h3>
                <p className="text-slate-500 text-xs sm:text-sm mb-6">Berikut adalah tiket tanda pendaftaran online Anda.</p>

                {/* Ticket Details Box */}
                <div className="bg-white border border-slate-150 rounded-2xl p-6 text-left max-w-md mx-auto space-y-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider py-1 px-3 rounded-bl-xl">
                    Online Ticket
                  </div>
                  
                  <div className="border-b border-dashed border-slate-200 pb-3">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kode Antrean</p>
                    <p className="text-2xl font-extrabold text-emerald-700 tracking-wider">RANI-{bookingSuccess.id.split("-")[1].substring(4, 8)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-slate-400 font-semibold uppercase tracking-wide text-[9px]">Nama Pasien</p>
                      <p className="font-bold text-slate-800">{bookingSuccess.patientName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold uppercase tracking-wide text-[9px]">No. Telepon</p>
                      <p className="font-bold text-slate-800">{bookingSuccess.phone}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold uppercase tracking-wide text-[9px]">Dokter Tujuan</p>
                      <p className="font-bold text-slate-800">{bookingSuccess.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold uppercase tracking-wide text-[9px]">Jadwal Kunjungan</p>
                      <p className="font-bold text-slate-800">{bookingSuccess.date}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-400 font-semibold uppercase tracking-wide text-[9px]">Estimasi Jam Periksa</p>
                      <p className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded w-fit">{bookingSuccess.time} WIB</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-6 leading-relaxed">
                  Harap hadir 15 menit sebelum estimasi waktu periksa untuk verifikasi berkas di meja pendaftaran. Tunjukkan kode antrean di atas kepada petugas kami.
                </p>

                <button
                  onClick={() => setBookingSuccess(null)}
                  className="mt-8 inline-flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Daftar Janji Lainnya</span>
                </button>
              </div>
            ) : (
              /* Regular Booking Form */
              <form onSubmit={handleBookingSubmit} className="bg-slate-50 border border-slate-150 p-6 sm:p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-3">Formulir Pendaftaran Online</h3>
                
                {bookingError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs flex items-center gap-2">
                    <span>{bookingError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Lengkap Pasien *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Masukkan nama lengkap Anda"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Nomor Handphone / WhatsApp *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Contoh: 08123456789"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Alamat Email (Opsional)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Doctor Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Pilih Dokter Tujuan *</label>
                    <select
                      required
                      value={doctorId}
                      onChange={(e) => setDoctorId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="">-- Pilih Dokter & Spesialisasi --</option>
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id} disabled={doc.status !== "Aktif"}>
                          {doc.name} - {doc.role} {doc.status !== "Aktif" ? "(Cuti)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Appointment Date */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Tanggal Kunjungan *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Time Slot */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Estimasi Jam Periksa *</label>
                    <select
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="">-- Pilih Jam Periksa --</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot} WIB</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Patient Notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Keluhan Singkat / Catatan Medis (Opsional)</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Contoh: Demam tinggi sejak 2 hari, sakit tenggorokan, batuk kering..."
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center gap-4 border-t border-slate-200">
                  <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
                    <HelpCircle className="w-4 h-4 shrink-0" />
                    <span>Layanan konsultasi online terjamin privasinya.</span>
                  </div>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/25 transition-all transform active:scale-98 cursor-pointer"
                  >
                    {bookingLoading ? "Mengirim Data..." : "Konfirmasi Daftar Online"}
                  </button>
                </div>
              </form>
            )
          ) : (
            /* INQUIRY FORM */
            contactSuccess ? (
              /* Success contact submission */
              <div className="bg-teal-50 border-2 border-teal-500/20 rounded-3xl p-6 sm:p-10 text-center animate-scale-in">
                <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-1.5">Pesan Terkirim!</h3>
                <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed mb-6">
                  Terima kasih sudah menghubungi kami. Tim administrasi kami akan segera membalas pertanyaan Anda via Email atau WhatsApp secepatnya.
                </p>

                <button
                  onClick={() => setContactSuccess(false)}
                  className="inline-flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  <span>Kirim Pesan Baru</span>
                </button>
              </div>
            ) : (
              /* Regular Inquiry Form */
              <form onSubmit={handleContactSubmit} className="bg-slate-50 border border-slate-150 p-6 sm:p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-3">Hubungi Klinik / Tanya Layanan</h3>
                
                {contactError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs flex items-center gap-2">
                    <span>{contactError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Nama Lengkap Anda *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={msgName}
                        onChange={(e) => setMsgName(e.target.value)}
                        placeholder="Contoh: Andi Saputra"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Nomor Handphone / WhatsApp *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={msgPhone}
                        onChange={(e) => setMsgPhone(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Alamat Email (Opsional)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={msgEmail}
                        onChange={(e) => setMsgEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Message text */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Pesan Pertanyaan Anda *</label>
                  <textarea
                    required
                    rows={4}
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    placeholder="Tuliskan pertanyaan seputar layanan obat, asuransi, harga layanan, kerjasama korporat, dll..."
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-4 flex justify-end border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={contactLoading}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/25 transition-all cursor-pointer"
                  >
                    {contactLoading ? "Mengirim..." : "Kirim Pesan / Pertanyaan"}
                  </button>
                </div>
              </form>
            )
          )}
        </div>

      </div>
    </section>
  );
}
