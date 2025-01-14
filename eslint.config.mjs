import config from "@andreashuber69/eslint-config";

// eslint-disable-next-line import/no-anonymous-default-export, import/no-default-export
export default [
    ...config,
    {
        ignores: ["coverage/", "dist/", "src/test/**/*.js"],
    },
];
