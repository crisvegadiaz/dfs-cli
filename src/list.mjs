#!/usr/bin/env zx
import { $ } from "zx";
import printHelp from "./util/printHelp.mjs";
import printSection from "./util/printSection.mjs";
import text from "./text/list.json" with { type: "json" };
import { isFlatpakInstalled, isSnapInstalled } from "./util/flatpakAndSnap.mjs";
import createTable from "./util/createTable.js";

// --- Parsers ---

// Parsea la salida de lista de paquetes del sistema
function parseSystemPackages(output) {
  const table = createTable(
    ["Paquete", "Versión", "Repositorio"],
    [4, 3, 3]
  );

  output.split("\n").forEach((line, idx) => {
    if (idx === 0 || !line.trim()) return;

    const columns = line.split(/\s{2,}/);
    if (columns.length >= 3) {
      table.push([
        columns[0].trim(),
        columns[1].trim(),
        columns[2].trim()
      ]);
    }
  });

  return table.toString();
}

// Parsea la salida de lista de Flatpak
function parseFlatpakPackages(output) {
  const table = createTable(
    ['Name', 'ID', 'Version', 'Branch', 'Origin'],
    [2, 3, 1, 1, 1]
  );

  output.split("\n").forEach(line => {
    const [name, id, version, branch, origin] = line.split("\t");
    if (name && id && version && branch && origin) {
      table.push([
        name.trim(),
        id.trim(),
        version.trim(),
        branch.trim(),
        origin.trim()
      ]);
    }
  });

  return table.toString();
}

// Parsea la salida de lista de Snap
function parseSnapPackages(output) {
  const table = createTable(
    ["Name", "Version", "Rev", "Tracking", "Publisher", "Notes"],
    [3, 4, 1, 2, 3, 1]
  );

  output.split("\n").forEach((line, idx) => {
    if (idx === 0 || !line.trim()) return;

    const columns = line.split(/\s{2,}/);
    if (columns.length >= 6) {
      table.push([
        columns[0].trim(),
        columns[1].trim(),
        columns[2].trim(),
        columns[3].trim(),
        columns[4].trim(),
        columns[5].trim()
      ]);
    }
  });

  return table.toString();
}

// --- Main runner ---
async function runList({ label, color, isInstalled, cmd, parser }) {
  printSection(color, label);

  let command = cmd?.filter(Boolean);

  if (typeof isInstalled === "function") {
    const tool = await isInstalled();
    if (!tool) return;
    command = [tool.pack, tool.list, tool["--installed"]].filter(Boolean);
  }

  try {
    const { stdout } = await $`${command}`;
    console.log(parser(stdout));
  } catch (error) {
    printSection("red", `${text.error1} ${error}`);
  }
}

// --- Exported main function ---
export default async function list(commands, options) {
  const systemList = {
    label: text.title1,
    color: "yellow",
    cmd: [commands.pack, commands.list, commands["--installed"]],
    parser: parseSystemPackages
  };

  const flatpakList = {
    label: text.title2,
    color: "blue",
    isInstalled: isFlatpakInstalled,
    parser: parseFlatpakPackages
  };

  const snapList = {
    label: text.title3,
    color: "red",
    isInstalled: isSnapInstalled,
    parser: parseSnapPackages
  };

  switch (options) {
    case "-d":
      await runList(systemList);
      break;
    case "-f":
      await runList(flatpakList);
      break;
    case "-s":
      await runList(snapList);
      break;
    default:
      printSection("red", text.error2);
      printHelp(text.help);
      break;
  }
}
