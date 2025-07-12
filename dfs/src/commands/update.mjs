import language from "../utils/language.js";
import printHelp from "../utils/printHelp.mjs";
import runCommand from "../utils/runCommand.mjs";
import printSection from "../utils/printSection.mjs";
import {
  isFlatpakInstalled,
  isSnapInstalled,
} from "../utils/flatpakAndSnap.mjs";

let text = (
  await import(`../locales/${language()}/update.json`, {
    with: { type: "json" },
  })
).default;

// --- Exported main function ---
export default async function update(commands, option) {
  const systemUpdate = {
    label: text.title1,
    color: "yellow",
    cmd: [
      commands.pack,
      commands.update,
      commands["-y"],
      commands["--refresh"],
    ],
  };

  const flatpakUpdate = {
    label: text.title2,
    color: "blue",
    cmd: ["pack", "update", "-y"],
    isInstalled: isFlatpakInstalled,
  };

  const snapUpdate = {
    label: text.title3,
    color: "red",
    cmd: ["pack", "update"],
    isInstalled: isSnapInstalled,
  };

  switch (option) {
    case "-d":
      await runCommand(systemUpdate);
      break;
    case "-f":
      await runCommand(flatpakUpdate);
      break;
    case "-s":
      await runCommand(snapUpdate);
      break;
    case undefined:
      await runCommand(systemUpdate);
      await runCommand(flatpakUpdate);
      await runCommand(snapUpdate);
      break;
    default:
      printSection("red", text.error);
      printHelp(text.help);
      break;
  }
}
