import { expect } from "chai";
import { readFileSync, rmSync } from "fs";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { JSDOM } from "jsdom";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { join } from "path";
import type { Configuration } from "webpack";
// tslint:disable-next-line: no-duplicate-imports match-default-export-name
import webpack from "webpack";

// tslint:disable-next-line: no-default-import
import AsyncCssPlugin from "../../AsyncCssPlugin";

const createConfig = (plugins: Configuration["plugins"]): Configuration => ({
    entry: `${__dirname}/index.js`,
    output: {
        path: `${__dirname}/dist`,
        filename: "index_bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                // tslint:disable-next-line: no-unsafe-any
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    plugins,
    mode: "development",
});

// tslint:disable-next-line: no-unsafe-any
const standardPlugins = [new HtmlWebpackPlugin(), new MiniCssExtractPlugin()];
const standardOptions = createConfig(standardPlugins);
const asyncOptions = createConfig([...standardPlugins, new AsyncCssPlugin({ logLevel: "info" })]);

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

describe(AsyncCssPlugin.name, () => {
    describe("webpack", () => {
        it("should not modify index.html", createMochaFunc(standardOptions, ""));
        it("should modify index.html", createMochaFunc(asyncOptions, "print"));
    });
});
