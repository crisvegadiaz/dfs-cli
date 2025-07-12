import { $ } from "zx";
import language from "./language.js";
import printSection from "./printSection.mjs";
import managers from "../locales/managers.json" with { type: "json" };

let text = (
  await import(`../locales/${language()}/getPackageManager.json`, {
    with: { type: "json" },
  })
).default;

export default async function getPackageManager() {
  try {
    const { stdout } = await $`grep '^ID=' /etc/os-release | cut -d= -f2`;
    switch (stdout.trim()) {
      case "ubuntu":
      case "debian":
        return managers.debian;
      case "fedora":
        return managers.fedora;
      case "arch":
        return managers.arch;
      default:
        printSection("red", text.warning);
        return null;
    }
  } catch (error) {
    printSection("red",`${text.error}, ${error.message}`)
    return null;
  }
}
