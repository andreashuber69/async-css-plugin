// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin
module.exports = {
    env: {
        // The plugin itself runs in node, but some of the tests run in a browser environment
        browser: true,
    },
    extends: ["@andreashuber69"],
    ignorePatterns: ["/**/*.config.js"],
};
