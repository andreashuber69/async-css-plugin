// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin

import HtmlWebpackPlugin from "html-webpack-plugin";
import { describe, expect, it } from "vitest";
import type { Compilation, Compiler } from "webpack";

import AsyncCssPlugin from "./AsyncCssPlugin.js";
import type { MessageType } from "./Options.js";

const createFakeCompiler = () => {
    const result = {
        hooks: {
            compilation: {
                tap: (options: string, fn: (compilation: Compilation) => void) => result.taps.set(options, fn),
            },
        },
        taps: new Map<string, (compilation: Compilation) => void>(),
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return result as unknown as (Compiler & { taps: Map<string, (compilation: Compilation) => void> });
};

type AssetTagsInfo = Parameters<HtmlWebpackPlugin.Hooks["alterAssetTags"]["promise"]>[0];

const createStyleTags = (modifyInfo?: (info: AssetTagsInfo) => void): AssetTagsInfo => {
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

    modifyInfo?.(result);
    return result;
};

const createMochaFunc = (shouldModify: boolean, modifyInfo?: (info: AssetTagsInfo) => void) =>
    async () => {
        const sut = new AsyncCssPlugin({ logLevel: "info" });

        const fakeCompiler = createFakeCompiler();
        sut.apply(fakeCompiler);
        const taps = [...fakeCompiler.taps.values()];
        expect(taps.length).to.equal(1);
        // Since compilation is just used as key in a WeakMap, we can use an empty object.
        // eslint-disable-next-line @stylistic/max-len
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/consistent-type-assertions
        const compilation = {} as Compilation;
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
        const sut = new AsyncCssPlugin({ logLevel: "info" });

        const fakeCompiler = createFakeCompiler();
        sut.apply(fakeCompiler);
        const taps = [...fakeCompiler.taps.values()];
        expect(taps.length).to.equal(1);
        // Since compilation is just used as key in a WeakMap, we can use an empty object.
        // eslint-disable-next-line @stylistic/max-len
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion, @typescript-eslint/consistent-type-assertions
        const compilation = {} as Compilation;

        HtmlWebpackPlugin.getHooks(compilation).alterAssetTags =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            undefined as unknown as HtmlWebpackPlugin.Hooks["alterAssetTags"];

        expect(() => taps[0]?.(compilation)).to.throw(
            Error,
            "Cannot get alterAssetTags hook. Is your config missing the HtmlWebpackPlugin?",
        );
    });

    describe("constructor", () => {
        it("should throw for invalid options", () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            expect(() => new AsyncCssPlugin({ logLevel: "whatever" as unknown as MessageType })).to.throw(
                Error,
                "options.logLevel is invalid: whatever.",
            );
        });
    });

    describe("apply", () => {
        it("should throw for invalid compiler", () => {
            const sut = new AsyncCssPlugin();

            expect(() => sut.apply(undefined)).to.throw(
                Error,
                "compiler?.hooks?.compilation?.tap is undefined. Is your webpack package version too old?",
            );
        });
    });

    describe("apply", () => {
        it(
            "should do nothing when assetTags field is missing",
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            createMochaFunc(false, (i) => (i.assetTags = undefined as unknown as AssetTagsInfo["assetTags"])),
        );

        it(
            "should do nothing when assetTags.styles field is missing",
            createMochaFunc(
                false,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
                (i) => (i.assetTags.styles = undefined as unknown as AssetTagsInfo["assetTags"]["styles"]),
            ),
        );

        it(
            "should do nothing when assetTags.styles field is missing",
            createMochaFunc(
                false,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
                (i) => (i.assetTags.styles = undefined as unknown as AssetTagsInfo["assetTags"]["styles"]),
            ),
        );

        it(
            "should do nothing when assetTags.styles[0].attributes field is missing",
            createMochaFunc(
                false,
                (i) => {
                    const { assetTags: { styles } } = i;

                    if (styles[0]) {
                        styles[0].attributes =
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
                        undefined as unknown as AssetTagsInfo["assetTags"]["styles"][0]["attributes"];
                    }
                },
            ),
        );

        it("should modify a link without the media attribute", createMochaFunc(true, (i) => {
            const { styles } = i.assetTags;

            if (styles[0]) {
                styles[0].attributes["media"] = undefined;
            }
        }));

        it("should not modify a link with the media attribute", createMochaFunc(false));
    });
});
