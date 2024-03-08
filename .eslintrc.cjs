// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin
// eslint-disable-next-line import/no-commonjs, import/unambiguous
module.exports = {
    env: {
        node: true,
        // The plugin itself runs in node, but some of the tests run in a browser environment
        browser: true,
    },
    extends: ["@andreashuber69"],
    ignorePatterns: ["/coverage/", "/dist/", "/src/test/**/*.config.js"],
};
