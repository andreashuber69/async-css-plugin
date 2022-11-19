const AsyncCssPlugin = require("../../../dist/AsyncCssPlugin"); // Added for async CSS loading
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    configureWebpack: config => {
        config.entry.app = "./main.js";
    },
    chainWebpack: config => {
        // Added for async CSS loading
        config.plugin("html-webpack-plugin").use(HtmlWebpackPlugin);
        config.plugin("async-css-plugin").use(AsyncCssPlugin, [{ logLevel: "info" }]);
    },
};
