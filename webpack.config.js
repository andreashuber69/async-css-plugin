const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    // cSpell: ignore devtool
    devtool: "source-map",
    entry: "./src/AsyncCssPlugin.ts",
    module: {
        rules: [
            {
                use: "ts-loader",
            },
        ],
    },
    output: {
        filename: "AsyncCssPlugin.js",
        libraryExport: "default",
        libraryTarget: "commonjs2",
        path: path.resolve(__dirname, "dist"),
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    keep_classnames: true // We're using the class name in log output
                }
            }),
        ],
    },
    target: "node"
};
