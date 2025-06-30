#!/usr/bin/env zx
import { $ } from "zx";
import chalk from "chalk";
import managers from "../commands/managers.json" with { type: "json" };

async function isCommandInstalled(command, managerKey, notFoundMsg) {
  const { exitCode } = await $`command -v ${command}`.quiet();
  if (exitCode === 0) {
    return managers[managerKey];
  } else {
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
