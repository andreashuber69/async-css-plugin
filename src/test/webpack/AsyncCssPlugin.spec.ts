import { expect } from "chai";
import { rmSync } from "fs";
import { join } from "path";
import type { Configuration } from "webpack";
// tslint:disable-next-line: no-duplicate-imports
import webpack from "webpack";

import { getLinkProperties } from "../getLinkProperties";

// tslint:disable-next-line: no-default-import
import asyncOptions from "./async.config";
// tslint:disable-next-line: no-default-import
import standardOptions from "./standard.config";

const createMochaFunc = (options: Configuration, expectedMedia: string): Mocha.Func =>
    (done) => webpack(options, (err, stats) => {
        // tslint:disable-next-line: no-unused-expression
        expect(err).to.be.null;
        // tslint:disable-next-line: no-unused-expression
        expect(stats?.hasErrors()).to.be.false;
        const outputPath = stats?.toJson().outputPath || "";
        // tslint:disable-next-line: no-unused-expression
        expect(!!outputPath).to.be.true;
        const { href, media } = getLinkProperties(join(outputPath, "index.html"));
        expect(href).to.equal("main.css");
        expect(media).to.equal(expectedMedia);
        rmSync(outputPath, { recursive: true });
        done();
    });

describe("AsyncCssPlugin", () => {
    describe("webpack", () => {
        // tslint:disable-next-line: no-unsafe-any
        it("should not modify index.html", createMochaFunc(standardOptions, ""));
        // tslint:disable-next-line: no-unsafe-any
        it("should modify index.html", createMochaFunc(asyncOptions, "print"));
    });
});
