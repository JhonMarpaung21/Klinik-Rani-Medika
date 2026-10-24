import type { Doctor, Service } from "../types";

export const services: Service[] = [
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

export const doctors: Doctor[] = [
  {
    id: "dr-abal",
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
    image: ""
  },
  {
    id: "dr-danu",
    name: "dr. Danu Wijaya, Sp.A",
    role: "Spesialis Anak (Pediatri)",
    experience: "10 Tahun Pengalaman",
    education: "S1 & Spesialis Anak Universitas Airlangga (UNAIR)",
    schedule: "Senin, Rabu, Jumat (09.00 - 14.00)",
    status: "Cuti",
    rating: 5.0,
    reviewsCount: 120,
    image: ""
  }
];

