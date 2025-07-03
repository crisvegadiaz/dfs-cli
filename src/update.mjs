#!/usr/bin/env zx
import { $ } from "zx";
import printHelp from "./util/printHelp.mjs";
import printSection from "./util/printSection.mjs";
import text from "./text/update.json" with { type: "json" };
import { isFlatpakInstalled, isSnapInstalled } from "./util/flatpakAndSnap.mjs";

//  Ejecuta el comando de actualización para el tipo de paquete especificado.
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
  } catch {
    printSection("red", text.error1);
  }

  printSection("bgYellow", text.separator);
}

//  Ejecuta las actualizaciones según la opción seleccionada.
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
