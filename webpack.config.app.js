const path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    filename: "bundledApp.js",
    path: path.resolve(__dirname),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
};
