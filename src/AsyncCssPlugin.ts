import { Hooks } from "html-webpack-plugin";
import { Compiler } from "webpack";

interface UntypedHooks {
    [key: string]: unknown;
}

type Page = Parameters<Parameters<Hooks["htmlWebpackPluginAlterAssetTags"]["tap"]>[1]>[0];
type HtmlTagObject = Page["head"][0];

// tslint:disable-next-line: no-default-export
export default class AsyncCssPlugin {
    public apply(compiler: Compiler): void {
        if (!compiler.hooks) {
            throw new Error("Missing hooks property. The version of your webpack package is probably too old.");
        }

        compiler.hooks.compilation.tap(
            AsyncCssPlugin.name,
            (compilation) => this.checkHook(compilation.hooks as unknown as UntypedHooks));
    }

    private checkHook(hooks: UntypedHooks) {
        if (!hooks.htmlWebpackPluginAlterAssetTags) {
            throw new Error("Missing hook. Your webpack configuration is probably missing the HtmlWebpackPlugin.");
        }

        (hooks as unknown as Hooks).htmlWebpackPluginAlterAssetTags.tap(
            AsyncCssPlugin.name, (page) => this.processPage(page));
    }

    private processPage(page: Page) {
        for (const tag of page.head) {
            if ((tag.tagName === "link") && (tag.attributes.rel === "stylesheet")) {
                this.processTag(tag);
            }
        }

        return page;
    }

    // tslint:disable-next-line: prefer-function-over-method
    private processTag({ attributes }: HtmlTagObject) {
        if (attributes.media) {
            console.warn(`The link for ${attributes.href} already has a media attribute, will not modify.`);
        } else {
            attributes.media = "print";
            attributes.onload = attributes.onload ? `${attributes.onload};` : "";
            attributes.onload += "this.media='all'";
        }
    }
}
