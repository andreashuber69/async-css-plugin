// tslint:disable: file-name-casing
interface Relationship {
    readonly rel: string;
}

export const findElement = <T extends Relationship>(collection: HTMLCollection, ctor: new () => T) => {
    for (const item of collection) {
        if (item instanceof ctor && (item.rel === "stylesheet")) {
            return item;
        }
    }

    throw new Error(`${ctor.name} element not found.`);
};
