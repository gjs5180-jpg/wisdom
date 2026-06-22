import { rmSync } from "node:fs";
import { resolve, relative } from "node:path";

const projectRoot = process.cwd();
const target = resolve(projectRoot, ".next");
const relativeTarget = relative(projectRoot, target);

if (relativeTarget.startsWith("..") || relativeTarget === "") {
  throw new Error(`Refusing to remove unsafe path: ${target}`);
}

rmSync(target, { recursive: true, force: true });
console.log(`Removed ${relativeTarget || ".next"}`);
