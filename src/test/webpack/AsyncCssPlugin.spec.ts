import { expect } from "chai";
import { readFileSync, rmSync } from "fs";
import { JSDOM } from "jsdom";
import { join } from "path";
import type { Configuration } from "webpack";
// tslint:disable-next-line: no-duplicate-imports
import webpack from "webpack";

// tslint:disable-next-line: no-default-import
import asyncOptions from "./async.config.js";
// tslint:disable-next-line: no-default-import
import standardOptions from "./standard.config.js";

const findLinkElement = <T>(collection: HTMLCollection, ctor: new () => T) => {
    for (const item of collection) {
        if (item instanceof ctor) {
            return item;
        }
    }

    throw new Error(`${ctor.name} element not found.`);
};

const createMochaFunc = (options: Configuration, expectedMedia: string): Mocha.Func =>
    (done) => webpack(options, (err, stats) => {
        // tslint:disable-next-line: no-unused-expression
        expect(err).to.be.null;
        // tslint:disable-next-line: no-unused-expression
        expect(stats?.hasErrors()).to.be.false;
        const outputPath = stats?.toJson().outputPath || "";
        // tslint:disable-next-line: no-unused-expression
        expect(!outputPath).to.be.false;
        const { window } = new JSDOM(readFileSync(join(outputPath, "index.html")));
        const { href, rel, media } = findLinkElement(window.document.head.children, window.HTMLLinkElement);
        expect(href).to.equal("main.css");
        expect(rel).to.equal("stylesheet");
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
