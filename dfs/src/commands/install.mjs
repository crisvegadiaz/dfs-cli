import printHelp from "../utils/printHelp.mjs";
import runCommand from "../utils/runCommand.mjs";
import printSection from "../utils/printSection.mjs";
import text from "../locales/es/install.json" with { type: "json" };
import {isFlatpakInstalled, isSnapInstalled} from "../utils/flatpakAndSnap.mjs";

// --- Exported main function ---
export default async function install(commands, arg, option) {
  const systemInstall = {
    label: text.title1,
    color: "yellow",
    cmd: [commands.pack, commands.install, arg, commands["-y"]],
  };

  const flatpakInstall = {
    label: text.title2,
    color: "blue",
    cmd: ["pack", "install", [arg], "-y"],
    isInstalled: isFlatpakInstalled,
  };

  const snapInstall = {
    label: text.title3,
    color: "red",
    cmd: ["pack", "install", [arg], "-y"],
    isInstalled: isSnapInstalled,
  };

  switch (option) {
    case "-d":
      await runCommand(systemInstall);
      break;
    case "-f":
      await runCommand(flatpakInstall);
      break;
    case "-s":
      await runCommand(snapInstall);
      break;
    default:
      printSection("red", text.error);
      printHelp(text.help);
      break;
  }
}
