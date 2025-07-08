#!/usr/bin/env zx
import { $ } from "zx";
import printHelp from "../utils/printHelp.mjs";
import printSection from "../utils/printSection.mjs";
import text from "../locales/es/update.json" with { type: "json" };
import { isFlatpakInstalled, isSnapInstalled } from "../utils/flatpakAndSnap.mjs";

// --- Main runner ---
async function runUpdate({ label, color, isInstalled, cmd }) {
  printSection(color, label);

  let command = cmd?.filter(Boolean);

  if (typeof isInstalled === "function") {
    const tool = await isInstalled();
    if (!tool) return;
    command = [tool.pack, tool.update, tool["-y"]].filter(Boolean);
  }

  try {
    await $`${command}`;
  } catch (error){
    printSection("red", `${text.error1} ${error}`);
  }

  printSection("bgYellow", text.separator);
}

// --- Exported main function ---
export default async function update(commands, option) {
  const systemUpdate = {
    label: text.title1,
    color: "yellow",
    cmd: [commands.pack, commands.update, commands["-y"], commands["--refresh"]],
  };

  const flatpakUpdate = {
    label: text.title2,
    color: "blue",
    isInstalled: isFlatpakInstalled,
  };

  const snapUpdate = {
    label: text.title3,
    color: "red",
    isInstalled: isSnapInstalled,
  };

  switch (option) {
    case "-d":
      await runUpdate(systemUpdate);
      break;
    case "-f":
      await runUpdate(flatpakUpdate);
      break;
    case "-s":
      await runUpdate(snapUpdate);
      break;
    case undefined:
      await runUpdate(systemUpdate);
      await runUpdate(flatpakUpdate);
      await runUpdate(snapUpdate);
      break;
    default:
      printSection("red", text.error2);
      printHelp(text.help);
      break;
  }
}
