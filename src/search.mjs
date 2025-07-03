#!/usr/bin/env zx
import { $ } from "zx";
import Table from "cli-table3";
import printHelp from "./util/printHelp.mjs";
import printSection from "./util/printSection.mjs";
import text from "./text/search.json" with { type: "json" };
import { isFlatpakInstalled, isSnapInstalled } from "./util/flatpakAndSnap.mjs";

// Crea una tabla con anchos proporcionales a la terminal
const createTable = (headers, proportions) => {
  const width = process.stdout.columns || 120;
  const overhead = 3 * headers.length + 1;
  const usableWidth = width - overhead;
  const total = proportions.reduce((a, b) => a + b, 0);
  const colWidths = proportions.map((p) =>
    Math.floor(usableWidth * (p / total))
  );
  return new Table({ head: headers, colWidths, wordWrap: true });
};

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
  const table = createTable(["ID", "Paquete", "Descripción"], [4, 2, 4]);
  output.split("\n").forEach((line) => {
    const [packageName, description, id] = line.split("\t");
    if (id && packageName && description)
      table.push([id.trim(), packageName.trim(), description.trim()]);
  });
  return table.toString();
};

// Parsea la salida de búsqueda de Snap
const parseSnapPackages = (output) => {
  const table = createTable(["Paquete", "Descripción"], [4, 6]);
  output.split("\n").forEach((line) => {
    const columns = line.split(/\s{2,}/);
    if (columns.length >= 5) table.push([columns[0].trim(), columns[4].trim()]);
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
export default async function search(commands, searchTerm, options) {
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
    case undefined:
      await runSearch(systemSearch, searchTerm);
      await runSearch(flatpakSearch, searchTerm);
      await runSearch(snapSearch, searchTerm);
      break;
    default:
      printSection("red", text.error2);
      printHelp(text.help);
      break;
  }
}
