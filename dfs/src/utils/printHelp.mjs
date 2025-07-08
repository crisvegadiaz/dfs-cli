import printSection from "./printSection.mjs";

export default function printHelp(help) {
  if (!help || !Array.isArray(help)) {
    throw new Error('Help must be an array');
  }
  help.forEach((element) => {
    if (typeof element !== 'string') {
      console.warn('Help element is not a string:', element);
      return;
    }
    printSection("yellow", element);
  });
}
