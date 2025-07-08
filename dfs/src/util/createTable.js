import Table from "cli-table3";

// Crea una tabla con anchos proporcionales a la terminal
export default function createTable(headers, proportions) {
  if (!Array.isArray(headers) || !Array.isArray(proportions)) {
    throw new Error("Headers and proportions must be arrays");
  }
  if (headers.length !== proportions.length) {
    throw new Error("Headers and proportions arrays must have the same length");
  }
  if (proportions.some((p) => p <= 0)) {
    throw new Error("All proportions must be positive numbers");
  }

  const width = process.stdout.columns || 120;
  const overhead = 3 * headers.length + 1;
  const usableWidth = width - overhead;
  const total = proportions.reduce((a, b) => a + b, 0);
  const colWidths = proportions.map((p) =>
    Math.floor(usableWidth * (p / total))
  );

  return new Table({
    head: headers,
    colWidths,
    wordWrap: true,
    style: {
      "padding-left": 0,
      "padding-right": 0,
      head: ["yellow"],
      border: ["yellow"],
    },
    chars: { mid: "", "left-mid": "", "mid-mid": "", "right-mid": "" },
  });
}
