import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createApp } from "./server/app";
import { ClinicStore } from "./server/store";

dotenv.config();
async function setupServer() {
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT harus berupa angka antara 1 dan 65535.");
  const production = process.argv.includes("--production") || process.env.NODE_ENV === "production";
  const store = new ClinicStore(path.resolve(process.env.DATA_FILE ?? "data/clinic.json"));
  const app = createApp(store, process.env.ALLOWED_ORIGIN);
  const dataFile = path.resolve(process.env.DATA_FILE ?? "data/clinic.json").replaceAll("\\", "/");
  if (production) {
    const client = fileURLToPath(new URL("./client/", import.meta.url));
    app.use(express.static(client, { index: false }));
    app.get("/", (_req, res) => { res.sendFile(path.join(client, "index.html")); });
    app.use((_req, res) => { res.status(404).send("Halaman tidak ditemukan."); });
  } else {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: {
        middlewareMode: true,
        fs: { deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "**/data/**", dataFile] },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }
  const server = app.listen(port, process.env.HOST ?? (production ? "0.0.0.0" : "127.0.0.1"), () => {
    console.log("Klinik Rani Medika: http://localhost:" + port);
  });
  server.on("error", error => { console.error("Server gagal dimulai:", error.message); process.exitCode = 1; });
}
setupServer().catch(error => { console.error("Server gagal dimulai:", error.message); process.exitCode = 1; });
