import { allPeople } from "../lib/content.js";

const people = allPeople();
const pending = people.filter((person) => person.culture?.sourceLocale === "und");
const duplicateNames = people
  .map((person) => person.name)
  .filter((name, index, names) => names.indexOf(name) !== index);

if (pending.length > 0 || duplicateNames.length > 0) {
  if (pending.length > 0) {
    console.error("People missing reviewed cultural/source profiles:");
    for (const person of pending) console.error(`- ${person.name} (${person.slug})`);
  }

  if (duplicateNames.length > 0) {
    console.error("Duplicate person names:");
    for (const name of [...new Set(duplicateNames)]) console.error(`- ${name}`);
  }

  process.exit(1);
}

console.log(`Person cultural profiles OK: ${people.length} people`);
