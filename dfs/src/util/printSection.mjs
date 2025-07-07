import chalk from "chalk";

export default function printSection(color, label) {
  console.log(chalk[color].bold(label));
}
