// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin
import HtmlWebpackPlugin from "html-webpack-plugin";
import type { Compilation, Compiler } from "webpack";

import type { MessageType, Options } from "./Options";

class AsyncCssPlugin {
    public constructor(options?: Options) {
        ({ logLevel: this.logLevel } = { logLevel: "warn", ...options });

        switch (this.logLevel) {
            case "info":
            case "warn":
            case "error":
                break;
            default:
                throw new Error(`options.logLevel is invalid: ${this.logLevel}.`);
        }
    }

    public apply(compiler: Partial<Compiler> | null | undefined): void {
        const compilation = compiler?.hooks?.compilation;

        if (!compilation?.tap) {
            throw new Error("compiler?.hooks?.compilation?.tap is undefined. Is your webpack package version too old?");
        }

        compilation.tap(AsyncCssPlugin.name, (c) => this.checkHook(c));
    }

    private static log(messageType: MessageType, message: string) {
        console[messageType](`\n${AsyncCssPlugin.name}[${messageType}]: ${message}`);
    }

    private readonly logLevel: MessageType;

    private checkHook(compilation: Compilation) {
        const alterAssetTags = HtmlWebpackPlugin?.getHooks?.(compilation)?.alterAssetTags;

        if (!alterAssetTags?.tap) {
            throw new Error("Cannot get alterAssetTags hook. Is your config missing the HtmlWebpackPlugin?");
        }

        alterAssetTags.tap(AsyncCssPlugin.name, (data) => this.checkTags(data, data?.assetTags?.styles));
    }

    private checkTags<Output extends { readonly outputName: string }>(
        output: Output,
        tags: readonly HtmlWebpackPlugin.HtmlTagObject[] | null | undefined,
    ) {
        for (const { tagName, attributes } of tags ?? []) {
            if ((tagName === "link") && (attributes?.["rel"] === "stylesheet")) {
                this.processTag(output.outputName, attributes);
            }
        }

        return output;
    }

    private processTag(outputName: string, attributes: HtmlWebpackPlugin.HtmlTagObject["attributes"]) {
        if (attributes["media"]) {
            const message = `The link for ${attributes["href"]} already has a media attribute, will not modify.`;
            (this.logLevel !== "error") && AsyncCssPlugin.log("warn", message);
        } else {
            Object.assign(attributes, {
                media: "print",
                onload: [attributes["onload"], "this.media='all'"].filter(Boolean).join(";"),
            });

            const message = `${outputName}: Modified link to ${attributes["href"]}.`;
            (this.logLevel === "info") && AsyncCssPlugin.log("info", message);
        }
    }
}

export = AsyncCssPlugin;
