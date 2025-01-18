// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// eslint-disable-next-line import/no-default-export, import/no-anonymous-default-export
export default defineConfig({
    build: {
        lib: {
            entry: ["src/AsyncCssPlugin.ts"],
            fileName: "AsyncCssPlugin",
            formats: ["cjs"],
        },
        outDir: "dist",
        rollupOptions: {
            input: {
                AsyncCssPlugin: "src/AsyncCssPlugin.ts",
            },
        },
        sourcemap: true,
        ssr: true,
    },
    plugins: [
        dts({
            rollupTypes: true,
            tsconfigPath: "tsconfig.json",
        }),
    ],
});
