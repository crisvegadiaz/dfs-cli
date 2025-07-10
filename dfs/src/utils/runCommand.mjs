#!/usr/bin/env zx
import { $ } from "zx";
import printSection from "../utils/printSection.mjs";

/**
 * Ejecuta un comando de shell de forma genérica, con opciones para verificar
 * la instalación de herramientas y manejar la salida.
 * @param {object} options - Las opciones para ejecutar el comando.
 * @param {string} options.label - La etiqueta para imprimir en la cabecera de la sección.
 * @param {string} options.color - El color para la cabecera de la sección.
 * @param {string[]} options.cmd - Las partes del comando. Si se provee `isInstalled`,
 *   estos son claves para el objeto `tool` devuelto.
 * @param {(stdout: string) => void} [options.func] - Una función opcional para procesar la salida estándar del comando.
 * @param {() => Promise<object|null>} [options.isInstalled] - Una función asíncrona opcional para verificar si una herramienta está instalada.
 */

export default async function runCommand({
  label,
  color,
  cmd,
  func,
  isInstalled,
}) {
  printSection(color, label);

  let command;

  if (isInstalled) {
    const tool = await isInstalled();
    if (!tool || typeof tool !== 'object') return;
    command = cmd
      .map((key) => (Array.isArray(key) ? key[0] : tool[key]))
      .filter(Boolean);
  } else {
    command = cmd.filter(Boolean);
  }

  try {
    const { stdout } = await $`${command}`;
    if (func) {
      func(stdout);
    } else if (stdout) {
      console.log(stdout);
    }
  } catch (error) {
    console.error(`Error al ejecutar el comando: ${command.join(" ")}`);
    if (error.stderr) {
      console.error(error.stderr);
    } else {
      console.error(error);
    }
  }
}
