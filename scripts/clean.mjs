import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
const root = new URL("../", import.meta.url);
for (const name of ["dist", "server.js"]) {
  rmSync(fileURLToPath(new URL(name, root)), { recursive: true, force: true });
}
