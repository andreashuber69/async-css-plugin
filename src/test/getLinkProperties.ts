// tslint:disable: file-name-casing
import { readFileSync } from "fs";
import { JSDOM } from "jsdom";

const findElement = <T extends { readonly rel: string }>(collection: HTMLCollection, ctor: new () => T) => {
    for (const item of collection) {
        if (item instanceof ctor && (item.rel === "stylesheet")) {
            return item;
        }
    }

    throw new Error(`${ctor.name} element not found.`);
};

export const getLinkProperties = (htmlPath: string) => {
    const { window } = new JSDOM(readFileSync(htmlPath));
    const { href, media } = findElement(window.document.head.children, window.HTMLLinkElement);

    return { href, media } as const;
};
