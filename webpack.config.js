const AsyncCssPlugin = require('./dist/AsyncCssPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = {
    entry: "./src/test/index.js",
    output: {
        path: path.resolve(__dirname, "./out"),
        filename: "index_bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    plugins: [new HtmlWebpackPlugin(), new AsyncCssPlugin(), new MiniCssExtractPlugin()],
};