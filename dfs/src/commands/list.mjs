import printHelp from "../utils/printHelp.mjs";
import runCommand from "../utils/runCommand.mjs";
import createTable from "../utils/createTable.js";
import printSection from "../utils/printSection.mjs";
import text from "../locales/es/list.json" with { type: "json" };
import { isFlatpakInstalled, isSnapInstalled } from "../utils/flatpakAndSnap.mjs";

// Parsea la salida de lista de paquetes del sistema
const formatDnfPackages = (output) => {
  const table = createTable(
    ["Repository", "Version", "Package"],
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
  console.log(table.toString());
}

const formatPacmanPackages = (output) => {
  const table = createTable(
    ["Name", "Version"],
    [5, 5]
  );

  output.split("\n").forEach((line, idx) => {
    if (idx === 0 || !line.trim()) return;
    
    const columns = line.split(" ");
    if (columns.length >= 2) {
      table.push([
        columns[0].trim(),
        columns[1].trim()
      ]);
    }
  });
  console.log(table.toString());
}

const formatAptPackages = (output) =>{
  const table = createTable(
    ["Package","Distribution", "Version","Architecture"],
    [3, 3, 2, 2]
  );

  output.split("\n").forEach((line) => {
    if (!line.trim() || line.startsWith("Listing...")) return;

    const parts = line.trim().split(/\s+/);

    if (parts.length >= 3) {
      const [pkgName, distribution] = parts[0].split('/');
      const version = parts[1];
      const arch = parts[2];

      if (pkgName && version && arch) {
        table.push([pkgName, distribution || 'n/a', version, arch]);
      }
    }
  });
  console.log(table.toString());
}

// Parsea la salida de lista de Flatpak
const formatFlatpakPackages = (output) => {
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
  console.log(table.toString());
}

// Parsea la salida de lista de Snap
const formatSnapPackages = (output) => {
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
  console.log(table.toString());
}

// --- Exported main function ---
export default async function list(commands, options) {
  const systemParsers = {
    pacman: formatPacmanPackages,
    dnf: formatDnfPackages,
    apt: formatAptPackages,
  };

  const systemList = {
    label: text.title1,
    color: "yellow",
    cmd: [commands.pack, commands.list, commands["--installed"]],
    func: systemParsers[commands.pack] || formatDnfPackages
  };

  const flatpakList = {
    label: text.title2,
    color: "blue",
    cmd: ["pack", "list", "--installed"],
    isInstalled: isFlatpakInstalled,
    func: formatFlatpakPackages
  };

  const snapList = {
    label: text.title3,
    color: "red",
    cmd: ["pack", "list"],
    isInstalled: isSnapInstalled,
    func: formatSnapPackages
  };

  switch (options) {
    case "-d":
      await runCommand(systemList);
      break;
    case "-f":
      await runCommand(flatpakList);
      break;
    case "-s":
      await runCommand(snapList);
      break;
    default:
      printSection("red", text.error);
      printHelp(text.help);
      break;
  }
}
