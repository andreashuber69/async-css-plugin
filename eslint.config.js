import generalConfig from "@andreashuber69/eslint-config";
import globals from "globals";
import tsEslint from "typescript-eslint";

const config = tsEslint.config([
    ...generalConfig,
    {
        files: ["src/**/*.ts"],
    },
    {
        ignores: ["coverage/", "dist/", "src/test/**/*.js"],
    },
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
    },
]);

// eslint-disable-next-line import/no-default-export
export default config;
