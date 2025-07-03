#!/usr/bin/env zx
import { $ } from "zx";
import chalk from "chalk";
import Table from "cli-table3";

async function runList({ label, color, isInstalled, cmd }) {
  printSection(color, label);

  let command = cmd?.filter(Boolean);

  if (typeof isInstalled === "function") {
    const tool = await isInstalled();
    if (!tool) return;
    command = [tool.pack, tool.list].filter(Boolean);
  }

  try {
    await $`${command}`;
  } catch {
    printSection("red", text.error1);
  }

  printSection("bgYellow", text.separator);
}

export default async function list(command, options) {
  switch (options) {
    case "-d":
      break;
    case "-f":
      break;
    case "-s":
      break;
    case undefined:
      break;
    default:
      break;
  }
}
