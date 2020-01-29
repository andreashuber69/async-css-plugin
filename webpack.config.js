const path = require("path");

module.exports = {
  entry: "./src/plugin.ts",
  // cSpell: ignore devtool
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
  },
  output: {
    filename: "plugin.js",
    path: path.resolve(__dirname, "dist"),
  },
};