import generalConfig from "@andreashuber69/eslint-config";
import tsEslint from "typescript-eslint";

const config = tsEslint.config([
    ...generalConfig,
    {
        ignores: ["coverage/", "dist/", "src/test/**/*.js"],
    },
]);

// eslint-disable-next-line import/no-default-export
export default config;
