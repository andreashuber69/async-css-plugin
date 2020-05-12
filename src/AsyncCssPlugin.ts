import * as HtmlWebpackPlugin from "html-webpack-plugin";

import { MessageType, Options } from "./Options";

// tslint:disable-next-line: no-default-export
class AsyncCssPlugin {
    public constructor(options: Options = {}) {
        Object.assign(this.options, options);
    }

    // tslint:disable-next-line: no-unsafe-any
    public apply({ hooks }: any): void {
        if (!hooks) {
            this.log("error", "hooks is undefined. Is the version of your webpack package too old?");
        }

        // tslint:disable-next-line: no-unsafe-any
        hooks.compilation.tap(AsyncCssPlugin.name, (compilation: any) => this.checkHook(compilation));
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

    private checkHook(compilation: any) {
        // tslint:disable: no-unsafe-any
        const { hooks: { htmlWebpackPluginAlterAssetTags } } = compilation;

        if (htmlWebpackPluginAlterAssetTags) {
            // html-webpack-plugin v3
            htmlWebpackPluginAlterAssetTags.tap(AsyncCssPlugin.name, (page: any) => this.checkTags(page, page.head));
            // tslint:enable: no-unsafe-any
        } else if (HtmlWebpackPlugin && HtmlWebpackPlugin.getHooks) {
            // html-webpack-plugin v4
            // tslint:disable-next-line: no-unsafe-any
            const hooks = HtmlWebpackPlugin.getHooks(compilation);
            hooks.alterAssetTags.tap(AsyncCssPlugin.name, (data) => this.checkTags(data, data.assetTags.styles));
        } else {
            this.log("error", "Cannot find hook. Is your configuration missing the HtmlWebpackPlugin?");
        }
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

    private checkTags<TOutput extends { readonly outputName: string }>(output: TOutput, tags: any[]) {
        // tslint:disable-next-line: no-unsafe-any
        for (const { tagName, attributes } of tags) {
            // tslint:disable-next-line: no-unsafe-any
            if ((tagName === "link") && (attributes.rel === "stylesheet")) {
                this.processTag(output.outputName, attributes);
            }
        }

        return output;
    }

    // tslint:disable: no-unsafe-any
    // tslint:disable-next-line: prefer-function-over-method
    private processTag(outputName: string, attributes: any) {
        if (attributes.media) {
            this.log("warn", `The link for ${attributes.href} already has a media attribute, will not modify.`);
        } else {
            attributes.media = "print";
            attributes.onload = attributes.onload ? `${attributes.onload};` : "";
            attributes.onload += "this.media='all'";
            this.log("info", `${outputName}: Modified link to ${attributes.href}.`);
        }
    }
    // tslint:enable: no-unsafe-any
}

export = AsyncCssPlugin;
