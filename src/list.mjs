#!/usr/bin/env zx
import { $ } from "zx";
import printHelp from "./util/printHelp.mjs";
import printSection from "./util/printSection.mjs";
import { isFlatpakInstalled, isSnapInstalled } from "./util/flatpakAndSnap.mjs";
import text from "./text/list.json" with { type: "json" };


async function runList({ label, color, isInstalled, cmd }) {
  printSection(color, label);

  let command = cmd?.filter(Boolean);

  if (typeof isInstalled === "function") {
    const tool = await isInstalled();
    if (!tool) return;
    command = [tool.pack, tool.list].filter(Boolean);
  }
  try {
    const { stdout } = await $`${command}`;
    console.log( stdout )
  } catch {
    printSection("red", text.error1);
  }

  printSection("bgYellow", text.separator);
}

export default async function list(commands, options) {
  const systemList = {
    label: text.title1,
    color: "yellow",
    cmd: [commands.pack, commands.list],
  };
  const flatpakList = {
    label: text.title2,
    color: "blue",
    isInstalled: isFlatpakInstalled,
  };

  const snapList = {
    label: text.title3,
    color: "red",
    isInstalled: isSnapInstalled,
  };

  switch (options) {
    case "-d":
      await runList(systemList)
      break;
    case "-f":
      await runList(flatpakList)
      break;
    case "-s":
      await runList(snapList)
      break;
    case undefined:
      await runList(systemList)
      await runList(flatpakList)
      await runList(snapList)
      break;
    default:
      printSection("red", text.error2);
      printHelp(text.help);
      break;
  }
}
