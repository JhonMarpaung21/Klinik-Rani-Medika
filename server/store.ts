import { mkdirSync, readFileSync, writeFileSync, renameSync, unlinkSync, openSync, fsyncSync, closeSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Appointment, ContactMessage, Review } from "../src/types";
import { isValidDate } from "../src/lib/booking";

export interface StoredData {
  reviews: Review[];
  appointments: Appointment[];
  contactMessages: ContactMessage[];
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const text = (value: unknown, maximum: number): value is string =>
  typeof value === "string" && value.trim().length > 0 && value.length <= maximum;
const optionalText = (value: unknown, maximum: number): boolean =>
  value === undefined || (typeof value === "string" && value.length <= maximum);
const optionalTimestamp = (value: unknown): boolean =>
  value === undefined || (typeof value === "string" && Number.isFinite(Date.parse(value)));
const phone = (value: unknown): boolean => typeof value === "string" && /^\+?\d{8,15}$/.test(value);

function validTime(value: unknown): boolean {
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d - ([01]\d|2[0-3]):[0-5]\d$/.test(value)) return false;
  const [start, end] = value.split(" - ");
  return start < end;
}

function assertStoredData(value: unknown): asserts value is StoredData {
  const ids = new Set<string>();
  const records = (items: unknown, valid: (item: Record<string, unknown>) => boolean): boolean =>
    Array.isArray(items) && items.every(item => {
      if (!isObject(item) || !text(item.id, 100) || ids.has(item.id) || !optionalTimestamp(item.createdAt) || !valid(item)) return false;
      ids.add(item.id);
      return true;
    });
  if (!isObject(value) ||
      !records(value.reviews, item => text(item.authorName, 100) && text(item.authorAvatar, 100) &&
        text(item.text, 2000) && text(item.timeAgo, 100) && text(item.source, 200) &&
        typeof item.rating === "number" && Number.isInteger(item.rating) && item.rating >= 1 && item.rating <= 5) ||
      !records(value.appointments, item => text(item.patientName, 100) && phone(item.phone) &&
        optionalText(item.email, 254) && text(item.doctorId, 100) && optionalText(item.doctorName, 200) &&
        typeof item.date === "string" && isValidDate(item.date) && validTime(item.time) &&
        optionalText(item.notes, 2000) && optionalText(item.status, 100)) ||
      !records(value.contactMessages, item => text(item.name, 100) && phone(item.phone) &&
        optionalText(item.email, 254) && text(item.message, 2000))) {
    throw new Error("Format penyimpanan klinik tidak valid. Periksa data asli sebelum memulai server.");
  }
}

export class ClinicStore {
  private data: StoredData;
  constructor(private readonly filename: string) {
    try {
      const data: unknown = JSON.parse(readFileSync(filename, "utf8"));
      assertStoredData(data);
      this.data = data;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      this.data = { reviews: [], appointments: [], contactMessages: [] };
    }
  }
  snapshot(): StoredData {
    return structuredClone(this.data);
  }
  // Synchronous transactions serialize writes in this single server process.
  update(change: (next: StoredData) => void): void {
    const next = this.snapshot();
    change(next);
    assertStoredData(next);
    mkdirSync(path.dirname(this.filename), { recursive: true, mode: 0o700 });
    const temporary = this.filename + "." + randomUUID() + ".tmp";
    try {
      writeFileSync(temporary, JSON.stringify(next), { encoding: "utf8", mode: 0o600, flag: "wx" });
      const descriptor = openSync(temporary, "r+");
      try { fsyncSync(descriptor); } finally { closeSync(descriptor); }
      renameSync(temporary, this.filename);
      this.data = next;
    } catch (error) {
      try { unlinkSync(temporary); } catch { /* Preserve the original error. */ }
      throw error;
    }
  }
}
