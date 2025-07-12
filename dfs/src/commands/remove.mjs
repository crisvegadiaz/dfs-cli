import language from "../utils/language.js";
import printHelp from "../utils/printHelp.mjs";
import runCommand from "../utils/runCommand.mjs";
import printSection from "../utils/printSection.mjs";
import {
  isFlatpakInstalled,
  isSnapInstalled,
} from "../utils/flatpakAndSnap.mjs";

let text = (
  await import(`../locales/${language()}/remove.json`, {
    with: { type: "json" },
  })
).default;

// --- Exported main function ---
export default async function remove(commands, arg, option) {
  console.log(arg);

  const systemRemove = {
    label: text.title1,
    color: "yellow",
    cmd: [commands.pack, commands.remove, arg, commands["-y"]],
  };

  const flatpakRemove = {
    label: text.title1,
    color: "blue",
    cmd: ["pack", "remove", [arg], "-y"],
    isInstalled: isFlatpakInstalled,
  };

  const snapRemove = {
    label: text.title2,
    color: "red",
    cmd: ["pack", "remove", [arg], "-y"],
    isInstalled: isSnapInstalled,
  };

  switch (option) {
    case "-d":
      await runCommand(systemRemove);
      break;
    case "-f":
      await runCommand(flatpakRemove);
      break;
    case "-s":
      await runCommand(snapRemove);
      break;
    default:
      printSection("red", text.error);
      printHelp(text.help);
      break;
  }
}
