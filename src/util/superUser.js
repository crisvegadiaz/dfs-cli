import printHepl from "./printHelp.mjs";
import printSection from "./printSection.mjs";
import text from "../text/superUser.json" with { type: "json" };

export default function superUser() {
  if (process.getuid() !== 0) {
    printSection("red", text.error);
    printHepl(text.help);
    process.exit(1);
  }
}
