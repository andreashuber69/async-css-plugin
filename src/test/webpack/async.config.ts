// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin

import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type { Configuration } from "webpack";
import AsyncCssPlugin from "../../AsyncCssPlugin.ts";

// eslint-disable-next-line import/no-default-export
export default {
    entry: `${__dirname}/index.js`,
    output: {
        path: `${__dirname}/dist`,
        filename: "index_bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/iu,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new AsyncCssPlugin({ logLevel: "info" }), // Added for async CSS loading
    ],
} satisfies Configuration;
