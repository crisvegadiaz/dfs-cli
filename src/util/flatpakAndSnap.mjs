#!/usr/bin/env zx
import { $ } from "zx";
import chalk from "chalk";
import managers from "../commands/managers.json" with { type: "json" };

async function isCommandInstalled(command, managerKey, notFoundMsg) {
  try {
    await $`command -v ${command}`.quiet();
    return managers[managerKey];
  } catch {
    console.log(chalk.green.bold(notFoundMsg));
    return null;
  }
}

export async function isFlatpakInstalled() {
  return isCommandInstalled(
    "flatpak",
    "flatpak",
    ">>> 󱧖 No Flatpak applications found.\n"
  );
}

export async function isSnapInstalled() {
  return isCommandInstalled(
    "snap",
    "snap",
    ">>> 󱧖 No Snap applications found.\n"
  );
}
