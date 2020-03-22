const path = require("path");

module.exports = {
  entry: "./contentScripts/subScripts/contentScript.js",
  output: {
    filename: "bundledContentScripts.js",
    path: path.resolve(__dirname)
  }
};
