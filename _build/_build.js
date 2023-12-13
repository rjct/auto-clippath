import esbuildWatchPlugin from "./esbuild-plugins/esbuild-watch-plugin.js";
import esbuild from "esbuild";

export function build(settings, watch = false) {
  if (watch) {
    (async () => {
      settings.plugins = [...settings.plugins, ...[esbuildWatchPlugin]];

      const ctx = await esbuild.context(settings);
      await ctx.watch();

      console.log("Watching...");
    })();
  } else {
    esbuild
      .build(settings)
      .then((result) => {
        console.log("Done.");
      })
      .catch(() => process.exit(1));
  }
}
