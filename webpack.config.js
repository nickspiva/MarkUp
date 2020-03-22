const path = require("path");

module.exports = {
  entry: "./contentScripts/index.js",
  output: {
    filename: "bundledContentScripts.js",
    path: path.resolve(__dirname, "dist")
  }
};
