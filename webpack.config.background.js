const path = require("path");

module.exports = {
  entry: ["@babel/polyfill", "./background.js"],
  output: {
    filename: "bundledBackground.js",
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
