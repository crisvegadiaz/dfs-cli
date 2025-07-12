import language from "./language.js";
import printHelp from "./printHelp.mjs";
import printSection from "./printSection.mjs";

let text = (
  await import(`../locales/${language()}/superUser.json`, {
    with: { type: "json" },
  })
).default;

export default function superUser() {
  if (!process.getuid || process.getuid() !== 0) {
    printSection("red", text.error);
    printHelp(text.help);
    process.exit(1);
  }
}
