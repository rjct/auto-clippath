import fs from "fs";
import path from "path";
import { copy } from "esbuild-plugin-copy";
import esbuildWatchPlugin from "./esbuild-plugins/esbuild-watch-plugin.js";

const packageJson = fs.readFileSync(
  path.join(process.cwd(), "./package.json"),
  "utf-8",
);

const packageJsonParsed = JSON.parse(packageJson);

export const settings = {
  entryPoints: ["./src/auto-clippath.ts"],
  plugins: [
    copy({
      assets: {
        from: ["./src/demo/*"],
        to: ["./demo"],
      },
      watch: false,
    }),
  ],
  bundle: true,
  sourcemap: "linked",
  minify: true,
  platform: "node",
  format: "esm",
  outfile: "./dist/auto-clippath.js",
  banner: {
    js: `/* 
${packageJsonParsed.name} v${packageJsonParsed.version} 
${packageJsonParsed.description}
${packageJsonParsed.homepage}
Copyright (c) 2023-present, ${packageJsonParsed.author}   
*/`,
  },
};
