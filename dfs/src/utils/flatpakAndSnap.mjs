#!/usr/bin/env zx
import { $ } from "zx";
import language from "./language.js";
import printSection from "./printSection.mjs";
import managers from "../locales/managers.json" with { type: "json" };

let text = (
  await import(`../locales/${language()}/flatpakAndSnap.json`, {
    with: { type: "json" },
  })
).default;

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
