import { settings } from "./settings.js";
import { build } from "./_build.js";

const args = process.argv.slice(2);

build(
  {
    ...settings,
    ...{
      platform: "neutral",
      format: "esm",
      entryPoints: ["./src/index-es6.ts"],
      outfile: "./dist/auto-clippath.esm.js",
    },
  },
  args.length > 1 && args[1].trim().toLowerCase() === "watch",
);
