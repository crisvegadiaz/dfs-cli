#!/usr/bin/env zx
import { $ } from "zx";
import printSection from "./printSection.mjs";
import managers from "../commands/managers.json" with { type: "json" };
import text from "../text/flatpakAndSnap.json" with { type: "json" };

async function isCommandInstalled(command, managerKey, notFoundMsg) {
  try {
    await $`command -v ${command}`.quiet();
    return managers[managerKey];
  } catch {
    printSection("green", notFoundMsg);
    return null;
  }
}

export async function isFlatpakInstalled() {
  return isCommandInstalled(
    "flatpak",
    "flatpak",
    text.title1 
  );
}

export async function isSnapInstalled() {
  return isCommandInstalled(
    "snap",
    "snap",
    text.title2
  );
}
