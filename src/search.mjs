#!/usr/bin/env zx
import { $ } from "zx";
import chalk from "chalk";
import Table from "cli-table3";
import { isFlatpakInstalled, isSnapInstalled } from "./util/flatpakAndSnap.mjs";

// Imprime una sección con color y formato
const printSection = (color, label) => console.log(chalk[color].bold(label));

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
  { label, color, isInstalled, cmd, parser, notInstalledMsg },
  searchTerm
) => {
  printSection(color, label);
  let command = cmd;
  if (typeof isInstalled === "function") {
    const tool = await isInstalled();
    if (!tool) {
      console.log(chalk.gray(notInstalledMsg));
      return;
    }
    command = [tool.dnf, tool.search, searchTerm];
  }
  try {
    const result = await $`${command}`;
    console.log(parser(result.stdout));
  } catch {
    console.log(chalk.red("Error ejecutando búsqueda.\n"));
  }
};

// Función principal de búsqueda
export default async function search(commands, searchTerm, options) {
  console.log(chalk.blue.bold(` Buscando: ${searchTerm}\n`));

  switch (options) {
    case "-d":
      await runSearch(
        {
          label: ">>>  Buscando paquetes con el gestor del sistema...\n",
          color: "yellow",
          cmd: [commands.dnf, commands.search, searchTerm],
          parser: parseSystemPackages,
          notInstalledMsg: "",
        },
        searchTerm
      );
      break;
    case "-f":
      await runSearch(
        {
          label: ">>>  Buscando aplicaciones Flatpak...\n",
          color: "blue",
          isInstalled: isFlatpakInstalled,
          parser: parseFlatpakPackages,
          notInstalledMsg: "Flatpak no está instalado.\n",
        },
        searchTerm
      );
      break;
    case "-s":
      await runSearch(
        {
          label: ">>>  Buscando aplicaciones Snap...\n",
          color: "red",
          isInstalled: isSnapInstalled,
          parser: parseSnapPackages,
          notInstalledMsg: "Snap no está instalado.\n",
        },
        searchTerm
      );
      break;
    default:
      console.error(chalk.yellow("Opción no reconocida. Usa -d, -f o -s.\n"));
      console.warn(
        chalk.gray(
          "Ejemplo: dfs search firefox -d \n" +
            "-d para buscar en el sistema \n" +
            "-f para buscar en Flatpak \n" +
            "-s para buscar en Snap \n"
        )
      );
      break;
  }
}
