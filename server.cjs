var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var services = [
  {
    id: "poly-gigi",
    title: "Layanan Dokter Gigi (Dental Care)",
    description: "Perawatan kesehatan gigi dan mulut lengkap mulai dari pembersihan karang gigi hingga perawatan saluran akar.",
    icon: "Smile",
    price: "Mulai Rp 150.000",
    duration: "30 - 60 Menit",
    features: [
      "Pembersihan Karang Gigi (Scaling & Polishing)",
      "Penambalan Gigi (Dental Filling)",
      "Cabut Gigi (Tooth Extraction)",
      "Perawatan Saluran Akar (Endodontik)",
      "Pembuatan Gigi Tiruan / Palsu (Denture)",
      "Pencegahan Gigi Berlubang Anak",
      "Konsultasi & Pemeriksaan Rutin"
    ]
  },
  {
    id: "poly-umum",
    title: "Layanan Dokter Umum (General Care)",
    description: "Pemeriksaan medis umum, tindakan medis kecil, laboratorium sederhana, dan vaksinasi.",
    icon: "Activity",
    price: "Mulai Rp 75.000",
    duration: "15 - 30 Menit",
    features: [
      "Konsultasi Medis & Pemeriksaan Fisik",
      "Vaksin Influenza",
      "Tes Buta Warna & Surat Sehat",
      "Cek Lab (Gula, Kolesterol, Asam Urat, HB)",
      "Tindakan Medis Kecil & Perawatan Luka",
      "Sunat",
      "Nebulizer (Terapi Uap)"
    ]
  },
  {
    id: "bpjs",
    title: "Layanan BPJS Kesehatan (FKTP)",
    description: "Fasilitas Kesehatan Tingkat Pertama melayani pemeriksaan umum, gigi, obat, dan rujukan dengan BPJS.",
    icon: "ShieldCheck",
    price: "Gratis (Ditanggung BPJS)",
    duration: "Sesuai Kebutuhan",
    features: [
      "Panduan & Layanan Pindah Faskes",
      "Pengobatan BPJS Terintegrasi",
      "Sistem Rujukan Online Rumah Sakit",
      "Program Prolanis (Diabetes, Hipertensi)",
      "Pemberian Obat BPJS (Fornas)"
    ]
  },
  {
    id: "kebidanan",
    title: "Kebidanan",
    description: "Pelayanan kesehatan untuk ibu, kehamilan, dan keluarga berencana.",
    icon: "Baby",
    price: "Mulai Rp 100.000",
    duration: "20 - 45 Menit",
    features: [
      "Layanan KB (Keluarga Berencana)",
      "Cek Kehamilan & Konsultasi"
    ]
  }
];
var doctors = [
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
    rating: 4.9,
    reviewsCount: 88,
    image: "/images/foto_rani.png"
  },
  {
    id: "dr-danu",
    name: "dr. Danu Wijaya, Sp.A",
    role: "Spesialis Anak (Pediatri)",
    experience: "10 Tahun Pengalaman",
    education: "S1 & Spesialis Anak Universitas Airlangga (UNAIR)",
    schedule: "Senin, Rabu, Jumat (09.00 - 14.00)",
    status: "Cuti",
    rating: 5,
    reviewsCount: 120,
    image: ""
  }
];
var initialReviews = [
  {
    id: "rev-1",
    authorName: "Andi Saputra",
    authorAvatar: "A",
    rating: 5,
    text: "Pelayanannya sangat ramah dan profesional. dr. Rani sangat teliti mendengarkan keluhan saya dan menjelaskan resep obat dengan sangat detail. Tempatnya bersih, nyaman, dan ber-AC dingin. Sangat direkomendasikan untuk warga sekitar!",
    timeAgo: "2 minggu lalu",
    source: "Google Maps"
  },
  {
    id: "rev-2",
    authorName: "Dewi Lestari",
    authorAvatar: "D",
    rating: 5,
    text: "Dokter giginya (drg. Citra) sabar sekali menghadapi anak saya yang takut cabut gigi. Peralatannya modern dan steril. Apotekernya juga cepat meracik obat, antrean teratur dengan sistem nomor digital.",
    timeAgo: "1 bulan lalu",
    source: "Google Maps"
  },
  {
    id: "rev-3",
    authorName: "Rian Hidayat",
    authorAvatar: "R",
    rating: 4,
    text: "Pelayanan poli umum sangat baik, dr. Budi ramah sekali. Ruang tunggu bersih dan luas. Hanya saja kalau sore antrean agak ramai, disarankan daftar lewat Whatsapp atau website dulu biar tidak menunggu terlalu lama.",
    timeAgo: "3 minggu lalu",
    source: "Google Maps"
  },
  {
    id: "rev-4",
    authorName: "Siti Rahmawati",
    authorAvatar: "S",
    rating: 5,
    text: "Sangat puas periksa kehamilan di KIA Klinik Rani Medika. Bidan dan dokternya ramah, tempat parkirnya luas, tarif pengobatan juga sangat terjangkau dibanding klinik besar lain dengan kualitas layanan yang sama.",
    timeAgo: "2 bulan lalu",
    source: "Google Maps"
  }
];
var reviews = [...initialReviews];
var appointments = [];
var contactMessages = [];
app.get("/api/services", (req, res) => {
  res.json(services);
});
app.get("/api/doctors", (req, res) => {
  res.json(doctors);
});
app.get("/api/reviews", (req, res) => {
  res.json(reviews);
});
app.post("/api/reviews", (req, res) => {
  const { authorName, rating, text } = req.body;
  if (!authorName || !rating || !text) {
    return res.status(400).json({ error: "Nama, rating, dan ulasan wajib diisi." });
  }
  const newReview = {
    id: `rev-${Date.now()}`,
    authorName,
    authorAvatar: authorName.charAt(0).toUpperCase(),
    rating: Number(rating),
    text,
    timeAgo: "Baru saja",
    source: "Klinik Rani Medika Website"
  };
  reviews = [newReview, ...reviews];
  res.status(201).json(newReview);
});
app.post("/api/appointments", (req, res) => {
  const { patientName, phone, email, doctorId, date, time, notes } = req.body;
  if (!patientName || !phone || !doctorId || !date || !time) {
    return res.status(400).json({ error: "Nama pasien, nomor telepon, pilihan dokter, tanggal, dan jam wajib diisi." });
  }
  const selectedDoctor = doctors.find((d) => d.id === doctorId);
  const newAppointment = {
    id: `apt-${Date.now()}`,
    patientName,
    phone,
    email,
    doctorId,
    doctorName: selectedDoctor ? selectedDoctor.name : "Dokter Umum",
    date,
    time,
    notes,
    status: "Dikonfirmasi",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  appointments.push(newAppointment);
  res.status(201).json({
    message: "Janji temu Anda berhasil didaftarkan!",
    appointment: newAppointment
  });
});
app.post("/api/contact", (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ error: "Nama, nomor telepon, dan pesan wajib diisi." });
  }
  const newMessage = {
    id: `msg-${Date.now()}`,
    name,
    email,
    phone,
    message,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  contactMessages.push(newMessage);
  res.status(201).json({
    message: "Pesan Anda berhasil dikirim! Tim kami akan segera menghubungi Anda.",
    contactMessage: newMessage
  });
});
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Klinik Rani Medika berjalan pada http://localhost:${PORT}`);
  });
}
setupServer();
//# sourceMappingURL=server.cjs.map
