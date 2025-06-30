#!/usr/bin/env zx
import { $ } from "zx";
import chalk from "chalk";
import Table from "cli-table3";

const printSection = (color, label) => console.log(chalk[color].bold(label));

// Table creators
const createTable = (head, colWidths) =>
  new Table({ head, colWidths, wordWrap: true });

// Package parsers
