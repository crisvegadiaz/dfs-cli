#!/usr/bin/env zx
import { $ } from "zx";
import printHelp from "./util/printHelp.mjs";
import createTable from "./util/createTable.js";
import printSection from "./util/printSection.mjs";
import text from "./text/search.json" with { type: "json" };
import { isFlatpakInstalled, isSnapInstalled } from "./util/flatpakAndSnap.mjs";

// Analizadores para la salida de búsqueda del gestor de paquetes del sistema
const formatDnfPackages = (output) => {
  const table = createTable(["Package", "Description"], [4, 6]);
  output.split("\n").forEach((line) => {
    const [name, ...desc] = line.split(":");
    if (desc.length) table.push([name.trim(), desc.join(":").trim()]);
  });
  return table.toString();
};

const formatPacmanPackages = (output) => {
  const table = createTable(["Package", "Version", "Description"], [3, 2, 5]);
  const lines = output.split("\n");

  for (let i = 0; i < lines.length - 1; i++) {
    const currentLine = lines[i];
    const nextLine = lines[i + 1];

    if (currentLine && !currentLine.startsWith(" ") && nextLine && nextLine.startsWith(" ")) {
      const [name, version] = currentLine.split(" ");
      const description = nextLine.trim();
      table.push([name, version, description]);
      i++; 
    }
  }
  return table.toString();
};

const formatAptPackages = (output) => {
  const table = createTable(["Package", "Version", "Description"], [3, 2, 5]);
  const lines = output.split("\n");

  for (let i = 0; i < lines.length - 1; i++) {
    const currentLine = lines[i];
    const nextLine = lines[i + 1];

    if (currentLine && !currentLine.startsWith(" ") && nextLine && nextLine.startsWith("  ")) {
      const parts = currentLine.split(" ");
      const name = parts[0].split("/")[0];
      const version = parts[1];
      const description = nextLine.trim();

      if (name && version && description) {
        table.push([name, version, description]);
        i++;
      }
    }
  }
  return table.toString();
};

// Parsea la salida de búsqueda de Flatpak
const formatFlatpakPackages = (output) => {
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
const formatSnapPackages = (output) => {
  const table = createTable(["Name", "Version", "Publisher", "Notes", "Summary"], [2, 2, 2, 1, 5]);
  output.split("\n").forEach((line) => {
    const columns = line.split(/\s{2,}/);
    if (columns.length >= 5) {
      table.push([
        columns[0].trim(),
        columns[1].trim(),
        columns[2].trim(),
        columns[3].trim(),
        columns[4].trim() 
      ]);
    }
  });
  return table.toString();
};

// --- Main runner ---
async function runSearch(
  { label, color, isInstalled, cmd, parser },
  searchTerm
) {
  printSection(color, label);

  let command = cmd?.filter(Boolean);

  if (typeof isInstalled === "function") {
    const tool = await isInstalled();
    if (!tool) return;
    command = [tool.pack, tool.search].filter(Boolean);
  }

  command.push(searchTerm);

  try {
    const {stdout} = await $`${command}`;
    console.log(parser(stdout));
  } catch (error){
    printSection("red", `${text.error1} ${error}`);
  }
};

// --- Exported main function ---
export default async function search(commands, searchTerm=null, options) {
  
  if(!searchTerm) return printSection("red", text.error2)

  const systemParsers = {
    pacman: formatPacmanPackages,
    dnf: formatDnfPackages,
    apt: formatAptPackages,
  };

  const systemSearch = {
    label: text.title1,
    color: "yellow",
    cmd: [commands.pack, commands.search, searchTerm],
    parser: systemParsers[commands.pack] || formatDnfPackages,
  };

  const flatpakSearch = {
    label: text.title2,
    color: "blue",
    isInstalled: isFlatpakInstalled,
    parser: formatFlatpakPackages,
  };

  const snapSearch = {
    label: text.title3,
    color: "red",
    isInstalled: isSnapInstalled,
    parser: formatSnapPackages,
  };

  switch (options) {
    case "-d":
      await runSearch(systemSearch, searchTerm);
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
