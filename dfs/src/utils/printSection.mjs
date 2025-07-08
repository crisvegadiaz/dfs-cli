import chalk from "chalk";

export default function printSection(color, label) {
  if (!color || typeof color !== 'string') {
    throw new Error('Color must be a non-empty string');
  }
  if (!label || typeof label !== 'string') {
    throw new Error('Label must be a non-empty string');
  }
  if (typeof chalk[color] !== 'function') {
    throw new Error(`Invalid color: ${color}`);
  }
  console.log(chalk[color].bold(label));
}
