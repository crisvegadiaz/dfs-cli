#!/usr/bin/env zx
import { $ } from "zx";
import chalk from "chalk";
import { isFlatpakInstalled, isSnapInstalled } from "./util/flatpakAndSnap.mjs";

export default async function update(commands, confirm) {
  
  console.log(
    chalk.yellow.bold(">>>  Actualizando paquetes del sistema...\n")
  );
  // Actualiza los paquetes del sistema
  const systemUpdateCmd = [
    commands.dnf,
    commands.update,
    commands["--refresh"],
  ];

  if (confirm && commands["-y"]) {
    systemUpdateCmd.push(commands["-y"]);
  }
  await $`${systemUpdateCmd}`;
  printSeparator();

  // Actualiza aplicaciones Flatpak si están instaladas
  const flatpak = await isFlatpakInstalled();
  if (flatpak) {
    console.log(
      chalk.blue.bold(">>>  Actualizando aplicaciones Flatpak...\n")
    );
    const flatpakUpdateCmd = [flatpak.dnf, flatpak.update];
    if (confirm && flatpak["-y"]) {
      flatpakUpdateCmd.push(flatpak["-y"]);
    }
    await $`${flatpakUpdateCmd}`;
    printSeparator();
  }

  // Actualiza aplicaciones Snap si están instaladas
  const snap = await isSnapInstalled();
  if (snap) {
    console.log(chalk.blue.bold(">>>  Actualizando aplicaciones Snap...\n"));
    const snapUpdateCmd = [snap.dnf, snap.update];

    if (confirm && snap["-y"]) {
      snapUpdateCmd.push(snap["-y"]);
    }
    await $`${snapUpdateCmd}`;
    printSeparator();
  }
}

function printSeparator() {
  console.log(chalk.bgYellow.bold("+=================================+\n"));
}
