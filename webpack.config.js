const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: "./src/test/index.js",
    output: {
        path: path.resolve(__dirname, "./out"),
        filename: "index_bundle.js",
    },
    plugins: [new HtmlWebpackPlugin()],
};