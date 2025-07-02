#!/usr/bin/env zx
import { $ } from "zx";
import chalk from "chalk";
import { isFlatpakInstalled, isSnapInstalled } from "./util/flatpakAndSnap.mjs";

async function runUpdate(commandArray) {
  try {
    await $`${commandArray}`;
  } catch (error) {
    if (error.exitCode === 1) {
      console.error(
        chalk.yellow(
          "\n>>> 󱧖 Operación cancelada por el usuario o ha ocurrido un error.\n"
        )
      );
    }
  }
}

function printSeparator() {
  console.log(chalk.bgYellow.bold("+=================================+\n"));
}

export default async function update(commands, options) {
  switch (options) {
    case "-d":
      // Actualiza los paquetes del sistema
      console.log(
        chalk.yellow.bold(">>>  Actualizando paquetes del sistema...\n")
      );
      const systemUpdateCmd = [
        commands.dnf,
        commands.update,
        commands["-y"],
        commands["--refresh"],
      ].filter(Boolean);
      await runUpdate(systemUpdateCmd);
      printSeparator();
      break;
    case "-f":
      // Actualiza aplicaciones Flatpak si está instalado
      const flatpak = await isFlatpakInstalled();
      if (flatpak) {
        console.log(
          chalk.blue.bold(">>>  Actualizando aplicaciones Flatpak...\n")
        );
        const flatpakUpdateCmd = [
          flatpak.dnf,
          flatpak.update,
          flatpak["-y"],
          flatpak["--refresh"],
        ].filter(Boolean);
        await runUpdate(flatpakUpdateCmd);
        printSeparator();
      }
      break;
    case "-s":
      // Actualiza aplicaciones Snap si está instalado
      const snap = await isSnapInstalled();
      if (snap) {
        console.log(
          chalk.blue.bold(">>>  Actualizando aplicaciones Snap...\n")
        );
        const snapUpdateCmd = [
          snap.dnf,
          snap.update,
          snap["-y"],
          snap["--refresh"],
        ].filter(Boolean);
        await runUpdate(snapUpdateCmd);
        printSeparator();
      }
      break;
    default:
      console.error(chalk.yellow("Opción no reconocida. Usa -d, -f o -s.\n"));
      console.warn(
        chalk.gray(
          "Ejemplo: dfs update -d \n" +
            "-d para actualizar el sistema \n" +
            "-f para actualizar aplicaciones Flatpak \n" +
            "-s para actualizar aplicaciones Snap \n"
        )
      );
  }
}
