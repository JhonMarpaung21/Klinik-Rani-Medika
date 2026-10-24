import assert from "node:assert/strict";
import test from "node:test";
import { getTimeSlots, isValidDate, jakartaDate } from "../src/lib/booking";

test("Jakarta calendar changes at 17:00 UTC regardless of the machine timezone", () => {
  assert.equal(jakartaDate(new Date("2026-10-26T16:59:59.999Z")), "2026-10-26");
  assert.equal(jakartaDate(new Date("2026-10-26T17:00:00.000Z")), "2026-10-27");
  assert.equal(jakartaDate(new Date("2026-12-31T17:00:00.000Z")), "2027-01-01");
});

test("date validation checks the calendar instead of allowing date rollover", () => {
  for (const value of ["2024-02-29", "2026-10-27", "2026-12-31"]) assert.equal(isValidDate(value), true, value);
  for (const value of ["", "2026-02-29", "2026-02-31", "2026-04-31", "2026-13-01", "2026-00-10", "2026-01-00", "26-01-01", "2026-1-01", "2026-10-27T00:00:00Z"])
    assert.equal(isValidDate(value), false, value);
});

test("unavailable doctors, closed days and past dates have no slots", () => {
  const now = new Date("2026-10-26T00:00:00Z");
  for (const doctorId of ["missing", "dr-danu"]) assert.deepEqual(getTimeSlots(doctorId, "2026-10-27", now), []);
  assert.deepEqual(getTimeSlots("drg-rani", "2026-10-26", now), []);
  assert.deepEqual(getTimeSlots("dr-budi", "2026-11-01", now), []);
  assert.deepEqual(getTimeSlots("dr-abal", "2026-10-24", now), []);
  assert.deepEqual(getTimeSlots("dr-abal", "2026-02-31", now), []);
});

test("dentist slots stay inside the published schedule", () => {
  const slots = getTimeSlots("drg-rani", "2026-10-27", new Date("2026-10-26T00:00:00Z"));
  assert.deepEqual(slots, ["14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00"]);
});

test("Saturday and evening slots respect both doctor and clinic hours", () => {
  const now = new Date("2026-10-23T00:00:00Z");
  assert.deepEqual(getTimeSlots("dr-abal", "2026-10-24", now), ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"]);
  assert.deepEqual(getTimeSlots("dr-budi", "2026-10-24", now), ["13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "18:30 - 19:30"]);
});

test("slots that already started are excluded using Jakarta time", () => {
  const now = new Date("2026-10-27T08:00:00Z");
  assert.deepEqual(getTimeSlots("drg-rani", "2026-10-27", now), ["16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00"]);
  assert.deepEqual(getTimeSlots("drg-rani", "2026-10-27", new Date("2026-10-27T12:00:00Z")), []);
  assert.equal(getTimeSlots("drg-rani", "2026-10-27", new Date("2026-10-27T06:59:59Z"))[0], "14:00 - 15:00");
});
