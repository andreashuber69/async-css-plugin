const AsyncCssPlugin = require("../../../dist/AsyncCssPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    configureWebpack: config => {
        config.entry.app = "./main.js";
    },
    // Added for async css loading
    chainWebpack: config => {
        config.plugin("html-webpack-plugin").use(HtmlWebpackPlugin);
        config.plugin("async-css-plugin").use(AsyncCssPlugin, [{ logLevel: "info" }]);
    },
};
