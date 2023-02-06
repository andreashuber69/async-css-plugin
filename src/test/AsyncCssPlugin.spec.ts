// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin
import { expect } from "chai";
import HtmlWebpackPlugin from "html-webpack-plugin";
import type { Compilation } from "webpack";

// We need to use plain old require here, so that the compiled output is only loaded during the test run. Otherwise, tsc
// will complain that it cannot overwrite an input file.
// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, import/no-commonjs, @typescript-eslint/no-require-imports
const AsyncCssPlugin = require("../../dist/AsyncCssPlugin");

const createFakeCompiler = () => {
    const result = {
        hooks: {
            compilation: {
                tap: (options: string, fn: (compilation: Compilation) => void) => result.taps.set(options, fn),
            },
        },
        taps: new Map<string, (compilation: Compilation) => void>(),
    };

    return result;
};

type AssetTagsInfo = Parameters<HtmlWebpackPlugin.Hooks["alterAssetTags"]["promise"]>[0];

// eslint-disable-next-line @typescript-eslint/no-empty-function
const createStyleTags = (modifyInfo: (info: AssetTagsInfo) => void = () => {}): AssetTagsInfo => {
    const result = {
        assetTags: {
            scripts: new Array<HtmlWebpackPlugin.HtmlTagObject>(),
            styles: [
                {
                    attributes: {
                        href: "whatever.css",
                        rel: "stylesheet",
                        media: "media",
                    },
                    tagName: "link",
                    voidTag: false,
                    meta: {},
                },
            ],
            meta: new Array<HtmlWebpackPlugin.HtmlTagObject>(),
        },
        publicPath: "",
        outputName: "someOutput.html",
        plugin: new HtmlWebpackPlugin(),
    };

    modifyInfo(result);

    return result;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const createMochaFunc = (shouldModify: boolean, modifyInfo: (info: AssetTagsInfo) => void = () => {}) =>
    async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const sut = new AsyncCssPlugin({ logLevel: "info" });

        const fakeCompiler = createFakeCompiler();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        sut.apply(fakeCompiler);
        const taps = [...fakeCompiler.taps.values()];
        expect(taps.length).to.equal(1);
        // Since compilation is just used as key in a WeakMap, we can use an empty object.
        const compilation = {} as unknown as Compilation;
        taps[0]?.(compilation);
        const styleTags = createStyleTags(modifyInfo);
        await HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.promise(styleTags);

        if (shouldModify) {
            expect(JSON.stringify(styleTags)).to.not.equal(JSON.stringify(createStyleTags(modifyInfo)));
        } else {
            expect(JSON.stringify(styleTags)).to.equal(JSON.stringify(createStyleTags(modifyInfo)));
        }
    };


describe("AsyncCssPlugin", () => {
    it("should throw when alterAssetTags hook is not available", () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const sut = new AsyncCssPlugin({ logLevel: "info" });

        const fakeCompiler = createFakeCompiler();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        sut.apply(fakeCompiler);
        const taps = [...fakeCompiler.taps.values()];
        expect(taps.length).to.equal(1);
        // Since compilation is just used as key in a WeakMap, we can use an empty object.
        const compilation = {} as unknown as Compilation;
        HtmlWebpackPlugin.getHooks(compilation).alterAssetTags =
            undefined as unknown as HtmlWebpackPlugin.Hooks["alterAssetTags"];
        expect(() => taps[0]?.(compilation)).to.throw(
            Error,
            "Cannot get alterAssetTags hook. Is your config missing the HtmlWebpackPlugin?",
        );
    });

    describe("constructor", () => {
        it("should throw for invalid options", () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
            expect(() => new AsyncCssPlugin({ logLevel: "whatever" })).to.throw(
                Error,
                "options.logLevel is invalid: whatever.",
            );
        });
    });

    describe("apply", () => {
        it("should throw for invalid compiler", () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            const sut = new AsyncCssPlugin();
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            expect(() => sut.apply()).to.throw(
                Error,
                "compiler?.hooks?.compilation?.tap is undefined. Is your webpack package version too old?",
            );
        });
    });

    describe("apply", () => {
        it("should modify a link without the media attribute", createMochaFunc(true, (i) => {
            const { styles } = i.assetTags;

            if (styles[0]) {
                styles[0].attributes["media"] = undefined;
            }
        }));
        it("should not modify a link with the media attribute", createMochaFunc(false));
    });
});
