import express, { type ErrorRequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { doctors, services } from "../src/data/clinic";
import { getTimeSlots, isValidDate, jakartaDate } from "../src/lib/booking";
import { ClinicStore } from "./store";

class InputError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
function objectBody(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new InputError("Isi permintaan harus berupa objek JSON.");
  return value as Record<string, unknown>;
}
function field(body: Record<string, unknown>, key: string, label: string, max: number, optional = false): string {
  const value = body[key];
  if (optional && (value === undefined || value === "")) return "";
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) {
    throw new InputError(label + " wajib berupa teks, tidak kosong, dan maksimal " + max + " karakter.");
  }
  return value.trim();
}
function contacts(body: Record<string, unknown>) {
  const phone = field(body, "phone", "Nomor telepon", 25).replace(/[\s()-]/g, "");
  if (!/^\+?\d{8,15}$/.test(phone)) throw new InputError("Nomor telepon harus berisi 8-15 digit.");
  const email = field(body, "email", "Email", 254, true);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new InputError("Alamat email tidak valid.");
  return { phone, email };
}
export function createApp(store: ClinicStore, allowedOrigin = "") {
  const app = express();
  app.disable("x-powered-by");
  app.use("/api", (_req, res, next) => {
    res.set({ "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    next();
  });
  app.use("/api", (req, res, next) => {
    if (req.headers.origin && allowedOrigin && req.headers.origin === allowedOrigin) {
      res.set({ "Access-Control-Allow-Origin": allowedOrigin, "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" });
      res.vary("Origin");
    }
    if (req.method === "OPTIONS") { res.sendStatus(204); return; }
    next();
  });
  const requests = new Map<string, { count: number; expires: number }>();
  app.use("/api", (req, res, next) => {
    if (req.method !== "POST") { next(); return; }
    const now = Date.now();
    for (const [key, value] of requests) if (value.expires <= now) requests.delete(key);
    const key = req.ip ?? "unknown";
    const current = requests.get(key) ?? { count: 0, expires: now + 10 * 60_000 };
    if (current.count >= 30 || (!requests.has(key) && requests.size >= 10_000)) {
      res.set("Retry-After", String(Math.ceil((current.expires - now) / 1000)));
      res.status(429).json({ error: "Terlalu banyak permintaan. Silakan coba beberapa saat lagi." });
      return;
    }
    current.count++;
    requests.set(key, current);
    if (!req.is("application/json")) {
      res.status(415).json({ error: "Gunakan Content-Type application/json." });
      return;
    }
    next();
  });
  app.use(express.json({ limit: "16kb" }));
  app.get("/api/services", (_req, res) => { res.json(services); });
  app.get("/api/doctors", (_req, res) => { res.json(doctors); });
  app.get("/api/reviews", (_req, res) => { res.json(store.snapshot().reviews); });
  app.post("/api/reviews", (req, res) => {
    const body = objectBody(req.body);
    const authorName = field(body, "authorName", "Nama", 100);
    const text = field(body, "text", "Ulasan", 2000);
    if (typeof body.rating !== "number" || !Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) {
      throw new InputError("Rating harus berupa bilangan bulat antara 1 dan 5.");
    }
    const review = {
      id: "rev-" + randomUUID(), authorName, authorAvatar: Array.from(authorName)[0].toUpperCase(),
      rating: body.rating, text, timeAgo: "Baru saja", source: "Website Klinik Rani Medika", createdAt: new Date().toISOString(),
    };
    store.update(next => { next.reviews.unshift(review); });
    res.status(201).json(review);
  });
  app.post("/api/appointments", (req, res) => {
    const body = objectBody(req.body);
    const patientName = field(body, "patientName", "Nama pasien", 100);
    const { phone, email } = contacts(body);
    const doctorId = field(body, "doctorId", "Dokter", 100);
    const doctor = doctors.find(item => item.id === doctorId);
    if (!doctor || doctor.status !== "Aktif") throw new InputError("Dokter tidak tersedia untuk pendaftaran.");
    const date = field(body, "date", "Tanggal", 10);
    const time = field(body, "time", "Jam", 13);
    if (!isValidDate(date) || date < jakartaDate()) throw new InputError("Tanggal kunjungan tidak valid atau sudah lewat.");
    if (!getTimeSlots(doctorId, date).includes(time)) throw new InputError("Jam yang dipilih tidak tersedia pada jadwal dokter.");
    const notes = field(body, "notes", "Catatan", 2000, true);
    const appointment = {
      id: "apt-" + randomUUID(), patientName, phone, email, doctorId, doctorName: doctor.name,
      date, time, notes, status: "Menunggu konfirmasi", createdAt: new Date().toISOString(),
    };
    store.update(next => {
      if (next.appointments.some(item => item.doctorId === doctorId && item.date === date && item.time === time)) {
        throw new InputError("Jadwal ini sudah terisi. Silakan pilih jam lainnya.", 409);
      }
      next.appointments.push(appointment);
    });
    res.status(201).json({ message: "Permintaan janji temu tersimpan dan menunggu konfirmasi klinik.", appointment });
  });
  app.post("/api/contact", (req, res) => {
    const body = objectBody(req.body);
    const name = field(body, "name", "Nama", 100);
    const { phone, email } = contacts(body);
    const message = field(body, "message", "Pesan", 2000);
    const contactMessage = { id: "msg-" + randomUUID(), name, phone, email, message, createdAt: new Date().toISOString() };
    store.update(next => { next.contactMessages.push(contactMessage); });
    res.status(201).json({ message: "Pesan Anda telah tersimpan.", id: contactMessage.id });
  });
  app.use("/api", (_req, res) => { res.status(404).json({ error: "Endpoint API tidak ditemukan." }); });
  const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
    if (error instanceof InputError) { res.status(error.status).json({ error: error.message }); return; }
    const type = (error as { type?: string })?.type;
    if (type === "entity.parse.failed") { res.status(400).json({ error: "Format JSON tidak valid." }); return; }
    if (type === "entity.too.large") { res.status(413).json({ error: "Ukuran permintaan terlalu besar." }); return; }
    console.error("Gagal memproses permintaan:", error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ error: "Data belum tersimpan. Silakan coba lagi atau hubungi klinik." });
  };
  app.use(errorHandler);
  return app;
}
