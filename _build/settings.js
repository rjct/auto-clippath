import fs from "fs";
import path from "path";

const packageJson = fs.readFileSync(
  path.join(process.cwd(), "./package.json"),
  "utf-8",
);

const packageJsonParsed = JSON.parse(packageJson);

export const settings = {
  entryPoints: ["./src/index.ts"],
  bundle: true,
  sourcemap: "linked", // external
  minify: true,
  target: ["es6"],
  outfile: "./dist/auto-clippath.min.js",
  banner: {
    js: `/* 
${packageJsonParsed.name} v${packageJsonParsed.version} 
${packageJsonParsed.description}
${packageJsonParsed.homepage}
Licensed GPLv3 for open source use, or Commercial License for commercial use - https://github.com/mzusin/index/blob/main/LICENSE.md    
Copyright (c) 2023-present, ${packageJsonParsed.author}   
*/`,
  },
};
