const path = require("path");

module.exports = {
  // cSpell: ignore devtool
  devtool: 'source-map',
  entry: "./src/plugin.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: "plugin.js",
    libraryExport: "default",
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts"],
  },
  target: "node"
};
