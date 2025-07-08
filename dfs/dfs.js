#!/usr/bin/node
import list from "./src/commands/list.mjs";
import update from "./src/commands/update.mjs";
import search from "./src/commands/search.mjs";
import superUser from "./src/utils/superUser.js";
import printHelp from "./src/utils/printHelp.mjs";
import printSection from "./src/utils/printSection.mjs";
import text from "./src/locales/es/main.json" with { type: "json" };
import getPackageManager from "./src/utils/getPackageManager.mjs";

const commands = await getPackageManager();

if (!commands) {
  printSection("red", text.error1);
  process.exit(1);
}

switch (process.argv[2]) {
  case "update":
    superUser();
    await update(commands, process.argv[3], process.argv[4]);
    break;
  case "search":
    await search(commands, process.argv[3], process.argv[4]);
    break;
  case "list":
    await list(commands, process.argv[3]);
    break;
  default:
    printSection("red",text.error2);
    printHelp(text.help);
    break;
}
