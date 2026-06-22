import { readFileSync } from "node:fs";
import { allContentEntries } from "../lib/content.js";

const seedData = JSON.parse(readFileSync("data/global_phrase_seeds.json", "utf8"));
const entries = allContentEntries();
const routes = new Set(seedData.nodes.map((node) => node.route));
const duplicateRoutes = seedData.nodes
  .map((node) => node.route)
  .filter((route, index, all) => all.indexOf(route) !== index);
const missing = entries.filter((entry) => !routes.has(entry.href));
const stale = seedData.nodes.filter(
  (node) => !entries.some((entry) => entry.href === node.route)
);
const draft = seedData.nodes.filter((node) => node.translationStatus === "draft");

if (duplicateRoutes.length > 0) {
  console.error(`Duplicate English routes: ${[...new Set(duplicateRoutes)].join(", ")}`);
  process.exit(1);
}

if (missing.length > 0) {
  console.error("Missing English seeds:");
  for (const entry of missing) {
    console.error(`- ${entry.href} (${entry.title})`);
  }
  console.error("Run: npm run english:sync");
  process.exit(1);
}

if (stale.length > 0) {
  console.error("Stale English seeds:");
  for (const node of stale) {
    console.error(`- ${node.route}`);
  }
  console.error("Run: npm run english:sync");
  process.exit(1);
}

console.log(
  `English coverage OK: ${seedData.nodes.length}/${entries.length} routes, ${draft.length} draft translations`
);
