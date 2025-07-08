import printHelp from "./printHelp.mjs";
import printSection from "./printSection.mjs";
import text from "../locales/es/superUser.json" with { type: "json" };

export default function superUser() {
  if (!process.getuid || process.getuid() !== 0) {
    printSection("red", text.error);
    printHelp(text.help);
    process.exit(1);
  }
}
