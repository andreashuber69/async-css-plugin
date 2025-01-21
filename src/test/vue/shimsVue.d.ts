// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin

// eslint-disable-next-line import/unambiguous
declare module "*.vue" {
    import type { DefineComponent } from "vue";

    const component: DefineComponent<unknown, unknown, unknown>;

    // eslint-disable-next-line import/no-default-export
    export default component;
}
