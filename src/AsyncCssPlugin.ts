import HtmlWebpackPlugin from "html-webpack-plugin";
import type { Compilation, Compiler } from "webpack";

import type { MessageType, Options } from "./Options";

class AsyncCssPlugin {
    public constructor(options?: Options) {
        this.options = { logLevel: "warn", ...options };

        switch (this.options.logLevel) {
            case "info":
            case "warn":
            case "error":
                break;
            default:
                throw new Error(`options.logLevel is invalid: ${this.options.logLevel}.`);
        }
    }

    public apply(compiler: Partial<Compiler> | null | undefined): void {
        const compilation = compiler?.hooks?.compilation;

        if (!compilation?.tap) {
            throw new Error("compiler?.hooks?.compilation?.tap is undefined. Is your webpack package version too old?");
        }

        compilation.tap(AsyncCssPlugin.name, (c) => this.checkHook(c));
    }

    private readonly options: Required<Options>;

    private log(messageType: MessageType, message: string) {
        if (this.doLog(messageType)) {
            console[messageType](`\n${AsyncCssPlugin.name}[${messageType}]: ${message}`);
        }
    }

    private checkHook(compilation: Compilation) {
        const alterAssetTags = HtmlWebpackPlugin?.getHooks?.(compilation)?.alterAssetTags;

        if (!alterAssetTags?.tap) {
            throw new Error("Cannot get alterAssetTags hook. Is your config missing the HtmlWebpackPlugin?");
        }

        alterAssetTags.tap(AsyncCssPlugin.name, (data) => this.checkTags(data, data?.assetTags?.styles));
    }

    private doLog(messageType: MessageType) {
        switch (this.options.logLevel) {
            case "info":
                return true;
            case "warn":
                return messageType !== "info";
            default:
                return messageType === "error";
        }
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
            this.log("warn", `The link for ${attributes["href"]} already has a media attribute, will not modify.`);
        } else {
            Object.assign(attributes, {
                media: "print",
                onload: [attributes["onload"], "this.media='all'"].filter((e) => Boolean(e)).join(";"),
            });

            this.log("info", `${outputName}: Modified link to ${attributes["href"]}.`);
        }
    }
}

export = AsyncCssPlugin;
