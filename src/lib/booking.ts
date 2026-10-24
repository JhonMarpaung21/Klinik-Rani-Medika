import { doctors } from "../data/clinic";

// Published schedules intersected with clinic hours (08:00-19:30).
const schedule: Record<string, Record<number, [number, number][]>> = {
  "dr-abal": { 1: [[480, 780]], 2: [[480, 780]], 3: [[480, 780]], 4: [[480, 780]], 6: [[540, 720]] },
  "dr-budi": Object.fromEntries([1, 2, 3, 4, 5, 6].map(day => [day, [[780, 1020], [1110, 1260]]])),
  "drg-rani": { 2: [[840, 1140]], 3: [[840, 1140]], 4: [[840, 1140]] },
};
export function jakartaDate(now = new Date()): string {
  return new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + "T00:00:00Z");
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
const formatTime = (minutes: number) =>
  String(Math.floor(minutes / 60)).padStart(2, "0") + ":" + String(minutes % 60).padStart(2, "0");
export function getTimeSlots(doctorId: string, date: string, now = new Date()): string[] {
  const doctor = doctors.find(item => item.id === doctorId);
  if (!doctor || doctor.status !== "Aktif" || !isValidDate(date) || date < jakartaDate(now)) return [];
  const weekday = new Date(date + "T00:00:00Z").getUTCDay();
  const slots: string[] = [];
  for (const [start, end] of schedule[doctorId]?.[weekday] ?? []) {
    for (let minute = Math.max(start, 480); minute + 60 <= Math.min(end, 1170); minute += 60) {
      const startTime = formatTime(minute);
      if (new Date(date + "T" + startTime + ":00+07:00").getTime() > now.getTime()) {
        slots.push(startTime + " - " + formatTime(minute + 60));
      }
    }
  }
  return slots;
}
