#!/usr/bin/env zx
import { $ } from "zx";
import chalk from "chalk";
import Table from "cli-table3";
import { isFlatpakInstalled, isSnapInstalled } from "./util/flatpakAndSnap.mjs";

// Utilidad para imprimir secciones con color
const printSection = (color, label) => {
  console.log(chalk[color].bold(label));
};

// Crea una tabla cuyos anchos de columna se ajustan al terminal
const createTable = (headers, colProportions) => {
  const terminalWidth = process.stdout.columns || 120;
  // Overhead: (num_cols + 1) para bordes, y 2*num_cols para padding (izq/der 1)
  const tableOverhead = 3 * headers.length + 1;
  const tableWidth = terminalWidth - tableOverhead;
  const totalProportion = colProportions.reduce((sum, p) => sum + p, 0);

  const colWidths = colProportions.map((p) =>
    Math.floor(tableWidth * (p / totalProportion))
  );

  return new Table({ head: headers, colWidths, wordWrap: true });
};

// Parsea la salida de búsqueda de paquetes del sistema
function parseSystemPackages(output) {
  const table = createTable(["Paquete", "Descripción"], [4, 6]); // Proporciones 40%/60%
  output.split("\n").forEach((line) => {
    const [name, ...descParts] = line.split(":");
    if (descParts.length) {
      table.push([name.trim(), descParts.join(":").trim()]);
    }
  });
  return table.toString();
}

// Parsea la salida de búsqueda de Flatpak
function parseFlatpakPackages(output) {
  // Proporciones 40% ID, 20% Paquete, 40% Descripción
  const table = createTable(["ID", "Paquete", "Descripción"], [4, 2, 4]);
  output.split("\n").forEach((line) => {
    const [packageName, description, id] = line.split("\t");
    if (id && packageName && description) {
      table.push([id.trim(), packageName.trim(), description.trim()]);
    }
  });
  return table.toString();
}

// Parsea la salida de búsqueda de Snap
function parseSnapPackages(output) {
  const table = createTable(["Paquete", "Descripción"], [4, 6]); // Proporciones 40%/60%
  output.split("\n").forEach((line) => {
    const columns = line.split(/\s{2,}/);
    if (columns.length >= 5) {
      table.push([columns[0].trim(), columns[4].trim()]);
    }
  });
  return table.toString();
}

// Función principal de búsqueda
export default async function search(commands, searchTerm) {
  console.log(chalk.blue.bold(` Buscando: ${searchTerm}\n`));

  // Buscar en el sistema (ej: DNF)
  printSection(
    "yellow",
    ">>>  Buscando paquetes con el gestor del sistema...\n"
  );
  const systemCmd = [commands.dnf, commands.search, searchTerm];
  const systemResult = await $`${systemCmd}`;
  console.log(parseSystemPackages(systemResult.stdout));

  // Buscar en Flatpak
  printSection("blue", ">>>  Buscando aplicaciones Flatpak...\n");
  const flatpak = await isFlatpakInstalled();
  if (flatpak) {
    const flatpakCmd = [flatpak.dnf, flatpak.search, searchTerm];
    const flatpakResult = await $`${flatpakCmd}`;
    console.log(parseFlatpakPackages(flatpakResult.stdout));
  } else {
    console.log(chalk.gray("Flatpak no está instalado.\n"));
  }

  // Buscar en Snap
  printSection("red", ">>>  Buscando aplicaciones Snap...\n");
  const snap = await isSnapInstalled();
  if (snap) {
    const snapCmd = [snap.dnf, snap.search, searchTerm];
    const snapResult = await $`${snapCmd}`;
    console.log(parseSnapPackages(snapResult.stdout));
  } else {
    console.log(chalk.gray("Snap no está instalado.\n"));
  }
}
