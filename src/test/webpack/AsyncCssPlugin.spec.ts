import { rmSync } from "fs";
import { join } from "path";

import { expect } from "chai";
import type { Configuration } from "webpack";
import webpack from "webpack";

import { getLinkProperties } from "../getLinkProperties";

// @ts-expect-error TS7016
import asyncOptions from "./async.config";
// @ts-expect-error TS7016
import standardOptions from "./standard.config";


const createMochaFunc = (options: Configuration, expectedMedia: string): Mocha.Func =>
    (done) => webpack(options, (err, stats) => {
        expect(Boolean(err)).to.equal(false);
        expect(stats?.hasErrors()).to.equal(false);
        const outputPath = stats?.toJson().outputPath ?? "";
        expect(Boolean(outputPath)).to.equal(true);
        const { href, media } = getLinkProperties(join(outputPath, "index.html"));
        expect(href).to.equal("main.css");
        expect(media).to.equal(expectedMedia);
        rmSync(outputPath, { recursive: true });
        done();
    });

describe("AsyncCssPlugin", () => {
    describe("webpack", () => {
        it("should not modify index.html", createMochaFunc(standardOptions, ""));
        it("should modify index.html", createMochaFunc(asyncOptions, "print"));
    });
});
