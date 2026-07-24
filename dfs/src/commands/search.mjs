import language from "../utils/language.js";
import printHelp from "../utils/printHelp.mjs";
import runCommand from "../utils/runCommand.mjs";
import createTable from "../utils/createTable.js";
import printSection from "../utils/printSection.mjs";
import { isFlatpakInstalled, isSnapInstalled } from "../utils/flatpakAndSnap.mjs";

let text = (
  await import(`../locales/${language()}/search.json`, {
    with: { type: "json" },
  })
).default;

// Analizadores para la salida de búsqueda del gestor de paquetes del sistema
const formatDnfPackages = (output) => {
  const table = createTable(["Package", "Description"], [4, 6]);

  output.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed.startsWith("Package") ||
      trimmed.startsWith("Matched fields") ||
      trimmed.startsWith("Updating") ||
      trimmed.startsWith("Repositories loaded") ||
      trimmed.startsWith("Loaded plugins") ||
      trimmed.startsWith("No matches found") ||
      trimmed.startsWith("Warning") ||
      /^[┌└├─╞]+$/.test(trimmed) ||
      (trimmed.startsWith("│") && trimmed.split("│").every((cell) => !cell.trim()))
    ) {
      return;
    }

    const rowCells = line
      .replace(/^\s*│\s*|\s*│\s*$/g, "")
      .split("│")
      .map((cell) => cell.trim())
      .filter(Boolean);

    if (rowCells.length >= 1) {
      const firstCell = rowCells[0];
      if (/^Matched fields$/i.test(firstCell)) return;

      const [namePart, ...descPart] = firstCell.split(/\t/);
      let name = namePart?.trim() || "";
      let description = descPart.join(" ").trim();

      if (!description && rowCells.length > 1) {
        const secondCell = rowCells[1].trim();
        if (!/^name( \(exact\))?$|^name, summary$/i.test(secondCell)) {
          description = secondCell;
        }
      }

      if (!description) {
        const columns = firstCell.split(/\s{2,}/).map((c) => c.trim()).filter(Boolean);
        if (columns.length >= 2) {
          name = columns[0];
          description = columns.slice(1).join(" ");
        }
      }

      if (name) {
        table.push([name, description]);
      }
      return;
    }

    const colonMatch = line.match(/^([^:]+):\s*(.+)$/);
    if (colonMatch) {
      const [, name, description] = colonMatch;
      table.push([name.trim(), description.trim()]);
      return;
    }

    const columns = line.split(/\s{2,}/);
    if (columns.length >= 2) {
      table.push([columns[0].trim(), columns.slice(1).join(" ").trim()]);
    }
  });
  console.log(table.toString());
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
  console.log(table.toString());
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
  console.log(table.toString());
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
  console.log(table.toString());
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
  console.log(table.toString());
};

// --- Exported main function ---
export default async function search(commands, arg, options) {
  
  if(!arg) return printSection("red", text.error1)

  const systemParsers = {
    pacman: formatPacmanPackages,
    dnf: formatDnfPackages,
    apt: formatAptPackages,
  };

  const systemSearch = {
    label: text.title1,
    color: "yellow",
    cmd: [commands.pack, commands.search, arg],
    func: systemParsers[commands.pack] || formatDnfPackages,
  };

  const flatpakSearch = {
    label: text.title2,
    color: "blue",
    cmd: ["pack", "search", [arg]],
    func: formatFlatpakPackages,
    isInstalled: isFlatpakInstalled,
  };

  const snapSearch = {
    label: text.title3,
    color: "red",
    cmd: ["pack", "search", [arg]],
    func: formatSnapPackages,
    isInstalled: isSnapInstalled,
  };

  switch (options) {
    case "-d":
      await runCommand(systemSearch);
      break;
    case "-f":
      await runCommand(flatpakSearch);
      break;
    case "-s":
      await runCommand(snapSearch);
      break;
    default:
      printSection("red", text.error2);
      printHelp(text.help);
      break;
  }
}
