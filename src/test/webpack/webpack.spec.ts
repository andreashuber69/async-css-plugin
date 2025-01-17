// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin

import { rmSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import type { Configuration } from "webpack";
import webpack from "webpack";

import { getLinkProperties } from "../getLinkProperties.js";

import asyncOptions from "./async.config.js";
import standardOptions from "./standard.config.js";

const checkWebpack = async (
    options: Configuration,
    expectedMedia: string,
) => await new Promise<void>((resolve, reject) => webpack(options, (err, stats) => {
    if (err) {
        reject(err);
    } else {
        expect(stats?.hasErrors()).to.equal(false);
        const outputPath = stats?.toJson().outputPath ?? "";
        expect(Boolean(outputPath)).to.equal(true);
        const { href, media } = getLinkProperties(join(outputPath, "index.html"));
        expect(href).to.equal("main.css");
        expect(media).to.equal(expectedMedia);
        rmSync(outputPath, { recursive: true });
        resolve();
    }
}));

describe("AsyncCssPlugin", () => {
    describe("webpack", () => {
        it("should not modify index.html", async () => await checkWebpack(standardOptions, ""));
        it("should modify index.html", async () => await checkWebpack(asyncOptions, "print"));
    });
});
