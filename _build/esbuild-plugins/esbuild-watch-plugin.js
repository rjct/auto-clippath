export default {
  name: "watch-plugin",
  setup(build) {
    build.onEnd((result) => {
      console.log("Rebuild...");
    });
  },
};
