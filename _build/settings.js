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
  entryPoints: ["./src/index.ts"],
  plugins: [
    copy({
      assets: {
        from: ["./src/demo/*"],
        to: ["./"],
      },
      watch: false,
    }),
  ],
  bundle: true,
  sourcemap: "linked",
  minify: true,
  platform: "neutral",
  format: "esm",
  outfile: "./dist/auto-clippath.min.js",
  banner: {
    js: `/* 
${packageJsonParsed.name} v${packageJsonParsed.version} 
${packageJsonParsed.description}
${packageJsonParsed.homepage}
Copyright (c) 2023-present, ${packageJsonParsed.author}   
*/`,
  },
};
