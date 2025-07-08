import { $ } from "zx";
import printSection from "./printSection.mjs";
import managers from "../locales/managers.json" with { type: "json" };
import text from "../locales/es/getPackageManager.json" with { type: "json"};

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
