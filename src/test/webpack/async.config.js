const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AsyncCssPlugin = require("../../../dist/AsyncCssPlugin"); // Added for async CSS loading

module.exports = {
    entry: __dirname + "/index.js",
    output: {
        path: __dirname + "/dist",
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
    plugins: [
        new HtmlWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new AsyncCssPlugin({ logLevel: "info" }), // Added for async CSS loading
    ]
};
