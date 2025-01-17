// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin

// eslint-disable-next-line import/unambiguous
declare module "@vue/cli-service" {
    // eslint-disable-next-line @stylistic/max-len
    // https://stackoverflow.com/questions/58031204/control-webpack-verbosity-when-programmatically-starting-vue-cli-service-serve
    class Service {
        public constructor(workingDirectory: string);
        public init(mode: string);
        public run(command: string): Promise<unknown>;
    }

    // eslint-disable-next-line import/no-default-export
    export default Service;
}
