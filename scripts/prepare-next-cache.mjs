import { createHash } from "node:crypto";
import {
  lstatSync,
  mkdirSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const projectRoot = process.cwd();
const nextPath = join(projectRoot, ".next");
const cacheKey = createHash("sha1").update(projectRoot).digest("hex").slice(0, 12);
const cachePath = join(tmpdir(), `wdma-next-${cacheKey}`);
const useProjectCache = process.argv.includes("--project");

let nextStats;
try {
  nextStats = lstatSync(nextPath);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

if (nextStats) {
  rmSync(nextPath, { recursive: true, force: true });
}

if (useProjectCache) {
  mkdirSync(nextPath, { recursive: true });
  process.exit(0);
}

rmSync(cachePath, { recursive: true, force: true });
mkdirSync(cachePath, { recursive: true });
symlinkSync(cachePath, nextPath, "dir");
