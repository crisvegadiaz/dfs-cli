import printSection from "./printSection.mjs";

export default function printHelp(help) {
  help.forEach((element) => {
    printSection("yellow", element);
  });
}
