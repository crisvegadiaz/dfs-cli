#!/usr/bin/env zx
import { $ } from "zx";
import printHelp from "./util/printHelp.mjs";
import createTable from "./util/createTable.js";
import printSection from "./util/printSection.mjs";
import text from "./text/search.json" with { type: "json" };
import { isFlatpakInstalled, isSnapInstalled } from "./util/flatpakAndSnap.mjs";

// Parsea la salida de búsqueda de paquetes del sistema
const parseSystemPackages = (output) => {
  const table = createTable(["Paquete", "Descripción"], [4, 6]);
  output.split("\n").forEach((line) => {
    const [name, ...desc] = line.split(":");
    if (desc.length) table.push([name.trim(), desc.join(":").trim()]);
  });
  return table.toString();
};

// Parsea la salida de búsqueda de Flatpak
const parseFlatpakPackages = (output) => {
  const table = createTable(
    ["Name", "Description", "App ID", "Version", "Branch", "Remote"],
    [2, 4, 5, 2, 1, 1]
  );
  output.split("\n").forEach((line) => {
    const [name, description, appId, version, branch, remote] = line.split("\t");
    if (name && description && appId && version && branch && remote) {
      table.push([
        name.trim(),
        description.trim(),
        appId.trim(),
        version.trim(),
        branch.trim(),
        remote.trim()
      ]);
    }
  });
  return table.toString();
};

// Parsea la salida de búsqueda de Snap
const parseSnapPackages = (output) => {
  const table = createTable(["Name", "Version", "Publisher", "Notes", "Summary"], [2, 2, 2, 1, 5]);
  output.split("\n").forEach((line) => {
    const columns = line.split(/\s{2,}/);
    if (columns.length >= 5) {
      table.push([
        columns[0].trim(), // Name
        columns[1].trim(), // Version
        columns[2].trim(), // Publisher
        columns[3].trim(), // Notes
        columns[4].trim()  // Summary
      ]);
    }
  });
  return table.toString();
};

// Ejecuta una búsqueda y muestra los resultados
const runSearch = async (
  { label, color, isInstalled, cmd, parser },
  searchTerm
) => {
  printSection(color, label);

  let command = cmd?.filter(Boolean);

  if (typeof isInstalled === "function") {
    const tool = await isInstalled();
    if (!tool) return;
    command = [tool.pack, tool.search, searchTerm].filter(Boolean);
  }

  try {
    const result = await $`${command}`;
    console.log(parser(result.stdout));
  } catch {
    printSection("red", text.error1);
  }
};

// Función principal de búsqueda
export default async function search(commands, searchTerm=null, options) {
  
  if(!searchTerm) return printSection("red", text.error2)

  const systemSearch = {
    label: text.title1,
    color: "yellow",
    cmd: [commands.pack, commands.search, searchTerm],
    parser: parseSystemPackages,
  };

  const flatpakSearch = {
    label: text.title2,
    color: "blue",
    isInstalled: isFlatpakInstalled,
    parser: parseFlatpakPackages,
  };

  const snapSearch = {
    label: text.title3,
    color: "red",
    isInstalled: isSnapInstalled,
    parser: parseSnapPackages,
  };

  switch (options) {
    case "-d":
      await runSearch(systemSearch);
      break;
    case "-f":
      await runSearch(flatpakSearch, searchTerm);
      break;
    case "-s":
      await runSearch(snapSearch, searchTerm);
      break;
    default:
      printSection("red", text.error3);
      printHelp(text.help);
      break;
  }
}
