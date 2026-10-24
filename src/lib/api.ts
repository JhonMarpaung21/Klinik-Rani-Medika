import type { Appointment, Doctor, Review, Service } from "../types";
type Guard<T> = (value: unknown) => value is T;
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const strings = (value: Record<string, unknown>, keys: string[]) => keys.every(key => typeof value[key] === "string");
export const isDoctor: Guard<Doctor> = (value): value is Doctor =>
  object(value) && strings(value, ["id", "name", "role", "experience", "education", "schedule", "image"]) &&
  ["Aktif", "Cuti", "Tidak Aktif"].includes(String(value.status)) &&
  typeof value.rating === "number" && Number.isFinite(value.rating) && value.rating >= 0 && value.rating <= 5 &&
  typeof value.reviewsCount === "number" && Number.isInteger(value.reviewsCount) && value.reviewsCount >= 0;
export const isService: Guard<Service> = (value): value is Service =>
  object(value) && strings(value, ["id", "title", "description", "icon", "price", "duration"]) &&
  Array.isArray(value.features) && value.features.every(item => typeof item === "string");
export const isReview: Guard<Review> = (value): value is Review =>
  object(value) && strings(value, ["id", "authorName", "authorAvatar", "text", "timeAgo", "source"]) &&
  typeof value.rating === "number" && Number.isInteger(value.rating) && value.rating >= 1 && value.rating <= 5;
export const isBookingResponse: Guard<{ appointment: Appointment }> = (value): value is { appointment: Appointment } =>
  object(value) && object(value.appointment) &&
  strings(value.appointment, ["id", "patientName", "phone", "doctorId", "doctorName", "date", "time", "status"]);
export const isMessageResponse: Guard<{ message: string; id: string }> = (value): value is { message: string; id: string } =>
  object(value) && strings(value, ["message", "id"]);
export const arrayOf = <T,>(guard: Guard<T>): Guard<T[]> =>
  (value): value is T[] => Array.isArray(value) && value.every(guard);

const base = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/+$/, "");
export const apiEnabled = import.meta.env.MODE !== "static" || !!base;
export const offlineMessage = "Pendaftaran dan pesan online belum tersedia. Silakan hubungi klinik melalui WhatsApp.";
export async function requestJson<T>(endpoint: string, guard: Guard<T>, init: RequestInit = {}): Promise<T> {
  if (!apiEnabled) throw new Error(offlineMessage);
  const controller = new AbortController();
  const abort = () => controller.abort();
  init.signal?.addEventListener("abort", abort, { once: true });
  if (init.signal?.aborted) controller.abort();
  const timeout = setTimeout(abort, 12_000);
  try {
    const response = await fetch(base + "/api" + endpoint, { ...init, signal: controller.signal });
    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Layanan online tidak tersedia. Silakan coba lagi atau hubungi klinik.");
    }
    const data: unknown = await response.json();
    if (!response.ok) {
      throw new Error(object(data) && typeof data.error === "string" ? data.error : "Permintaan gagal. Silakan coba kembali.");
    }
    if (!guard(data)) throw new Error("Data dari server tidak valid. Silakan hubungi klinik.");
    return data;
  } catch (error) {
    if (controller.signal.aborted) {
      if (init.signal?.aborted) throw new DOMException("Permintaan dibatalkan", "AbortError");
      throw new Error(init.method === "POST"
        ? "Waktu tunggu habis. Status pengiriman belum dapat dipastikan; hubungi klinik sebelum mengirim ulang."
        : "Server terlalu lama merespons. Silakan coba kembali.");
    }
    if (error instanceof TypeError) throw new Error("Tidak dapat terhubung ke server. Periksa koneksi Anda atau hubungi klinik.");
    if (error instanceof SyntaxError) throw new Error("Respons server tidak valid. Silakan coba kembali.");
    throw error;
  } finally {
    clearTimeout(timeout);
    init.signal?.removeEventListener("abort", abort);
  }
}
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Terjadi kesalahan. Silakan coba kembali.";
}
