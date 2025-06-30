import { $ } from "zx";
import chalk from "chalk";
import managers from "../commands/managers.json" with { type: "json" };

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
        console.error(
          chalk.red.bold(
            "Unsupported OS. Please use Debian, Fedora, or Arch Linux."
          )
        );
        return null;
    }
  } catch (error) {
    console.error(chalk.red("Error detecting OS:"), error.message);
    return null;
  }
}
