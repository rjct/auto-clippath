import { settings } from "./settings.js";
import { build } from "./_build.js";

const args = process.argv.slice(2);

build(
  {
    ...settings,
    ...{
      platform: "browser",
      target: ["es2017"],
      entryPoints: ["./src/auto-clippath-browser.ts"],
      outfile: "./dist/auto-clippath-browser.mjs",
    },
  },
  args.length > 1 && args[1].trim().toLowerCase() === "watch",
);
