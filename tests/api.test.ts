import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test, { type TestContext } from "node:test";
import { createApp } from "../server/app";
import { ClinicStore } from "../server/store";
import { getTimeSlots, jakartaDate } from "../src/lib/booking";

function temporaryDirectory(t: TestContext): string {
  const root = path.resolve(tmpdir());
  const directory = mkdtempSync(path.join(root, "klinik-regression-"));
  t.after(() => {
    const target = path.resolve(directory);
    assert.equal(path.dirname(target), root, "Cleanup must stay inside the temporary directory");
    assert.ok(path.basename(target).startsWith("klinik-regression-"));
    rmSync(target, { recursive: true, force: true });
  });
  return directory;
}

async function fixture(t: TestContext, allowedOrigin = "") {
  const directory = temporaryDirectory(t);
  const filename = path.join(directory, "data", "clinic.json");
  const store = new ClinicStore(filename);
  const server = createApp(store, allowedOrigin).listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const base = "http://127.0.0.1:" + address.port;
  t.after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve());
      server.closeAllConnections();
    });
  });
  return {
    directory, filename, store,
    request: (url: string, init?: RequestInit) => fetch(base + url, init),
    post: (url: string, body: unknown) => fetch(base + url, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    }),
  };
}

async function jsonError(response: Response, status: number) {
  assert.equal(response.status, status);
  assert.match(response.headers.get("content-type") ?? "", /application\/json/);
  const body = await response.json();
  assert.equal(typeof body.error, "string");
  assert.ok(body.error.length > 0);
  assert.equal(body.stack, undefined);
}

function validBooking() {
  const future = new Date();
  future.setUTCDate(future.getUTCDate() + 7);
  while (new Date(jakartaDate(future) + "T00:00:00Z").getUTCDay() !== 2) {
    future.setUTCDate(future.getUTCDate() + 1);
  }
  const date = jakartaDate(future);
  const time = getTimeSlots("drg-rani", date)[0];
  assert.ok(time, "A future Tuesday must offer a dentist appointment");
  return { patientName: " Test Patient ", phone: "+62 (812) 3456-7890", email: "test@example.com", doctorId: "drg-rani", date, time, notes: " Test note " };
}

test("public catalog returns JSON and private data has no public listing", async t => {
  const api = await fixture(t);
  for (const route of ["/api/services", "/api/doctors"]) {
    const response = await api.request(route);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("x-powered-by"), null);
    const items = await response.json();
    assert.ok(Array.isArray(items) && items.length > 0);
    assert.ok(items.every(item => typeof item.id === "string"));
  }
  assert.deepEqual(await (await api.request("/api/reviews")).json(), []);
  for (const route of ["/api/appointments", "/api/contact", "/api/unknown"]) {
    await jsonError(await api.request(route), 404);
  }
  await jsonError(await api.request("/api/reviews", { method: "DELETE" }), 404);
});

test("malformed, non-object, missing, oversized and non-JSON requests return JSON errors", async t => {
  const api = await fixture(t);
  for (const body of [null, [], "text", 5, true, {}]) {
    await jsonError(await api.post("/api/reviews", body), 400);
  }
  await jsonError(await api.request("/api/reviews", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: "{invalid",
  }), 400);
  await jsonError(await api.request("/api/reviews", {
    method: "POST", headers: { "Content-Type": "application/json" },
  }), 400);
  await jsonError(await api.request("/api/reviews", {
    method: "POST", headers: { "Content-Type": "text/plain" }, body: "hello",
  }), 415);
  await jsonError(await api.post("/api/reviews", { authorName: "Test", rating: 5, text: "x".repeat(20_000) }), 413);
  assert.deepEqual(api.store.snapshot().reviews, []);
});

test("reviews reject invalid types, blank or overlong text and out-of-range ratings", async t => {
  const api = await fixture(t);
  const valid = { authorName: "Test", rating: 5, text: "Useful feedback" };
  const invalid = [
    { authorName: {} }, { authorName: [] }, { authorName: " " }, { authorName: "x".repeat(101) },
    { text: {} }, { text: " " }, { text: "x".repeat(2001) },
    ...[0, 6, -1, 1.5, "5", "invalid", null, true].map(rating => ({ rating })),
  ];
  for (const changes of invalid) await jsonError(await api.post("/api/reviews", { ...valid, ...changes }), 400);
  assert.deepEqual(api.store.snapshot().reviews, []);
});

test("accepted reviews and messages are normalized and survive a new store instance", async t => {
  const api = await fixture(t);
  const response = await api.post("/api/reviews", { authorName: " Ani ", rating: 4, text: " Pelayanan baik. " });
  assert.equal(response.status, 201);
  const review = await response.json();
  assert.equal(review.authorName, "Ani");
  assert.equal(review.text, "Pelayanan baik.");
  assert.equal(review.authorAvatar, "A");
  assert.match(review.id, /^rev-[0-9a-f-]{36}$/);
  assert.doesNotMatch(review.source, /Google/i);
  const contact = await api.post("/api/contact", { name: " Ani ", phone: "+62 (812) 3456-7890", email: "ani@example.com", message: " Mohon informasi. " });
  assert.equal(contact.status, 201);
  const receipt = await contact.json();
  assert.match(receipt.id, /^msg-[0-9a-f-]{36}$/);
  assert.equal(receipt.contactMessage, undefined);
  const reloaded = new ClinicStore(api.filename).snapshot();
  assert.deepEqual(reloaded.reviews, [review]);
  assert.equal(reloaded.contactMessages[0].name, "Ani");
  assert.equal(reloaded.contactMessages[0].phone, "+6281234567890");
  assert.equal(reloaded.contactMessages[0].message, "Mohon informasi.");
});

test("contact validation rejects invalid fields without persisting anything", async t => {
  const api = await fixture(t);
  const valid = { name: "Test", phone: "08123456789", email: "test@example.com", message: "Please contact me" };
  const invalid = [
    { name: {} }, { name: " " }, { name: "x".repeat(101) }, { phone: [] }, { phone: "no" },
    { phone: "123" }, { phone: "1".repeat(16) }, { email: "bad-address" }, { email: {} },
    { message: {} }, { message: " " }, { message: "x".repeat(2001) },
  ];
  for (const changes of invalid) await jsonError(await api.post("/api/contact", { ...valid, ...changes }), 400);
  assert.deepEqual(api.store.snapshot().contactMessages, []);
});

test("booking rejects invalid doctor, date, schedule and patient information", async t => {
  const api = await fixture(t);
  const valid = validBooking();
  const sunday = new Date(valid.date + "T00:00:00Z");
  sunday.setUTCDate(sunday.getUTCDate() + 5);
  const invalid = [
    { doctorId: "missing" }, { doctorId: "dr-danu" }, { doctorId: {} },
    { date: "garbage" }, { date: "2000-01-01" }, { date: "2099-02-31" }, { date: sunday.toISOString().slice(0, 10) },
    { time: "now" }, { time: "08:00 - 09:00" }, { time: "19:00 - 20:00" },
    { patientName: " " }, { patientName: {} }, { phone: "no" }, { email: "invalid" },
    { notes: {} }, { notes: "x".repeat(2001) },
  ];
  for (const changes of invalid) await jsonError(await api.post("/api/appointments", { ...valid, ...changes }), 400);
  assert.deepEqual(api.store.snapshot().appointments, []);
});

test("concurrent bookings reserve a slot once, stay pending and survive reload", async t => {
  const api = await fixture(t);
  const booking = validBooking();
  const responses = await Promise.all([
    api.post("/api/appointments", booking), api.post("/api/appointments", { ...booking, patientName: "Another Patient" }),
  ]);
  assert.deepEqual(responses.map(response => response.status).sort(), [201, 409]);
  await jsonError(responses.find(response => response.status === 409)!, 409);
  const success = await responses.find(response => response.status === 201)!.json();
  assert.equal(success.appointment.status, "Menunggu konfirmasi");
  assert.equal(success.appointment.doctorId, booking.doctorId);
  assert.equal(success.appointment.phone, "+6281234567890");
  assert.equal(success.appointment.notes, "Test note");
  const data = new ClinicStore(api.filename).snapshot();
  assert.deepEqual(data.appointments, [success.appointment]);
});

test("failed storage does not acknowledge or retain a mutation", async t => {
  const api = await fixture(t);
  writeFileSync(path.join(api.directory, "data"), "A file blocks the storage directory");
  await jsonError(await api.post("/api/reviews", { authorName: "Test", rating: 5, text: "Must not be retained" }), 500);
  assert.deepEqual(api.store.snapshot(), { reviews: [], appointments: [], contactMessages: [] });
});

test("store snapshots and failed transactions cannot mutate committed data", t => {
  const filename = path.join(temporaryDirectory(t), "clinic.json");
  const store = new ClinicStore(filename);
  store.update(next => { next.contactMessages.push({ id: "msg-test", name: "Test", phone: "08123456789", message: "Saved" }); });
  const persisted = readFileSync(filename, "utf8");
  store.snapshot().contactMessages[0].message = "Changed outside transaction";
  assert.throws(() => store.update(next => { next.contactMessages[0].message = "Rolled back"; throw new Error("rollback"); }), /rollback/);
  assert.equal(store.snapshot().contactMessages[0].message, "Saved");
  assert.equal(readFileSync(filename, "utf8"), persisted);
});

test("corrupt storage fails explicitly without replacing the original file", t => {
  const filename = path.join(temporaryDirectory(t), "clinic.json");
  for (const content of ["{broken", "null", "[]", '{"reviews":[],"appointments":[]}', '{"reviews":{},"appointments":[],"contactMessages":[]}']) {
    writeFileSync(filename, content);
    assert.throws(() => new ClinicStore(filename));
    assert.equal(readFileSync(filename, "utf8"), content);
  }
});

test("API limits repeated submissions and provides a retry interval", async t => {
  const api = await fixture(t);
  for (let i = 0; i < 30; i++) await jsonError(await api.post("/api/reviews", {}), 400);
  const limited = await api.post("/api/reviews", {});
  assert.ok(Number(limited.headers.get("retry-after")) > 0);
  await jsonError(limited, 429);
  assert.equal((await api.request("/api/reviews")).status, 200);
});

test("CORS grants access only to the configured origin", async t => {
  const origin = "https://clinic.example";
  const api = await fixture(t, origin);
  const permitted = await api.request("/api/reviews", { method: "OPTIONS", headers: { Origin: origin } });
  assert.equal(permitted.status, 204);
  assert.equal(permitted.headers.get("access-control-allow-origin"), origin);
  const other = await api.request("/api/reviews", { method: "OPTIONS", headers: { Origin: "https://other.example" } });
  assert.equal(other.headers.get("access-control-allow-origin"), null);
});


test("malformed stored records and duplicate IDs are rejected without modifying the file", t => {
  const filename = path.join(temporaryDirectory(t), "clinic.json");
  const review = { id: "rev-one", authorName: "Ani", authorAvatar: "A", rating: 5, text: "Good", timeAgo: "Baru saja", source: "Website" };
  const appointment = { id: "apt-one", patientName: "Ani", phone: "08123456789", doctorId: "drg-rani", date: "2026-10-27", time: "14:00 - 15:00" };
  const contact = { id: "msg-one", name: "Ani", phone: "08123456789", message: "Hello" };
  const examples: Record<string, unknown[]> = {
    reviews: [null, [], {}, { ...review, id: "" }, { ...review, authorName: {} }, { ...review, authorAvatar: null },
      { ...review, rating: "5" }, { ...review, rating: 6 }, { ...review, rating: 1.5 }, { ...review, text: " " },
      { ...review, timeAgo: null }, { ...review, source: [] }, { ...review, createdAt: "invalid" }],
    appointments: [null, {}, { ...appointment, id: undefined }, { ...appointment, patientName: [] }, { ...appointment, phone: false },
      { ...appointment, doctorId: null }, { ...appointment, doctorName: {} }, { ...appointment, date: "2026-02-31" },
      { ...appointment, time: "25:00 - 26:00" }, { ...appointment, time: "15:00 - 14:00" }, { ...appointment, email: [] },
      { ...appointment, notes: {} }, { ...appointment, status: false }],
    contactMessages: [null, {}, { ...contact, id: null }, { ...contact, name: " " }, { ...contact, phone: "bad" },
      { ...contact, email: false }, { ...contact, message: [] }, { ...contact, createdAt: {} }],
  };
  for (const [collection, invalidRecords] of Object.entries(examples)) {
    for (const invalidRecord of invalidRecords) {
      const content = JSON.stringify({ reviews: [], appointments: [], contactMessages: [], [collection]: [invalidRecord] });
      writeFileSync(filename, content);
      assert.throws(() => new ClinicStore(filename), /Format penyimpanan/);
      assert.equal(readFileSync(filename, "utf8"), content);
    }
  }
  for (const [collection, record] of Object.entries({ reviews: review, appointments: appointment, contactMessages: contact })) {
    const content = JSON.stringify({ reviews: [], appointments: [], contactMessages: [], [collection]: [record, record] });
    writeFileSync(filename, content);
    assert.throws(() => new ClinicStore(filename), /Format penyimpanan/);
    assert.equal(readFileSync(filename, "utf8"), content);
  }
  // Historical dates and doctors remain valid records even after their schedule changes.
  const valid = { reviews: [review], appointments: [{ ...appointment, date: "2000-01-01", doctorId: "retired-doctor" }], contactMessages: [contact] };
  writeFileSync(filename, JSON.stringify(valid));
  assert.deepEqual(new ClinicStore(filename).snapshot(), valid);
});

test("invalid internal transactions preserve the last valid data", t => {
  const filename = path.join(temporaryDirectory(t), "clinic.json");
  const store = new ClinicStore(filename);
  const message = { id: "msg-test", name: "Test", phone: "08123456789", message: "Saved" };
  store.update(next => { next.contactMessages.push(message); });
  const persisted = readFileSync(filename, "utf8");
  assert.throws(() => store.update(next => { next.contactMessages.push(message); }), /Format penyimpanan/);
  assert.throws(() => store.update(next => { next.contactMessages[0].name = " "; }), /Format penyimpanan/);
  assert.equal(readFileSync(filename, "utf8"), persisted);
  assert.deepEqual(store.snapshot().contactMessages, [message]);
});
