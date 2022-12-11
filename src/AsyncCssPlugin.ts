import HtmlWebpackPlugin from "html-webpack-plugin";
import type { Compilation, Compiler } from "webpack";

import type { MessageType, Options } from "./Options";

class AsyncCssPlugin {
    public constructor(options: Options = {}) {
        Object.assign(this.options, options);
    }

    public apply({ hooks }: Compiler): void {
        if (!hooks) {
            throw new Error("Compiler.hooks is undefined. Is your webpack package version too old?");
        }

        hooks.compilation.tap(AsyncCssPlugin.name, (compilation) => this.checkHook(compilation));
    }

    private static assertUnreachable(value: never): never {
        throw new Error(value);
    }

    private readonly options: Required<Options> = { logLevel: "warn" };
    private logged = false;

    private log(messageType: MessageType, message: string) {
        if (this.doLog(messageType)) {
            if (!this.logged) {
                this.logged = true;
                console.log(); // Make sure we start our log on a new line
            }

            console[messageType](`${AsyncCssPlugin.name}[${messageType}]: ${message}`);
        }
    }

    private checkHook(compilation: Compilation) {
        const alterAssetTags = HtmlWebpackPlugin?.getHooks?.(compilation)?.alterAssetTags;

        if (!alterAssetTags) {
            throw new Error("Cannot get alterAssetTags hook. Is your config missing the HtmlWebpackPlugin?");
        }

        alterAssetTags.tap(AsyncCssPlugin.name, (data) => this.checkTags(data, data.assetTags.styles));
    }

    private doLog(messageType: MessageType) {
        switch (this.options.logLevel) {
            case "info":
                return true;
            case "warn":
                return messageType !== "info";
            case "error":
                return messageType === "error";
            default:
                return AsyncCssPlugin.assertUnreachable(this.options.logLevel);
        }
    }

    private checkTags<Output extends { readonly outputName: string }>(
        output: Output,
        tags: HtmlWebpackPlugin.HtmlTagObject[],
    ) {
        for (const { tagName, attributes } of tags) {
            if ((tagName === "link") && (attributes["rel"] === "stylesheet")) {
                this.processTag(output.outputName, attributes);
            }
        }

        return output;
    }

    private processTag(outputName: string, attributes: HtmlWebpackPlugin.HtmlTagObject["attributes"]) {
        if (attributes["media"]) {
            this.log("warn", `The link for ${attributes["href"]} already has a media attribute, will not modify.`);
        } else {
            attributes["media"] = "print";
            attributes["onload"] = attributes["onload"] ? `${attributes["onload"]};` : "";
            attributes["onload"] += "this.media='all'";
            this.log("info", `${outputName}: Modified link to ${attributes["href"]}.`);
        }
    }
}

export = AsyncCssPlugin;
