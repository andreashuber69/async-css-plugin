<h1 align="center">
  <img width="128" src="https://raw.githubusercontent.com/andreashuber69/async-css-plugin/master/doc/icon.svg?sanitize=true">
</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/async-css-plugin">
    <img src="https://img.shields.io/npm/v/async-css-plugin" alt="NPM Version">
  </a>
  <a href="https://github.com/andreashuber69/async-css-plugin/releases/latest">
    <img src="https://img.shields.io/github/release-date/andreashuber69/async-css-plugin.svg" alt="Release Date">
  </a>
  <a href="https://travis-ci.com/andreashuber69/async-css-plugin">
    <img src="https://travis-ci.com/andreashuber69/async-css-plugin.svg?branch=develop" alt="Build">
  </a>
  <a href="https://github.com/andreashuber69/async-css-plugin/issues">
    <img src="https://img.shields.io/github/issues-raw/andreashuber69/async-css-plugin.svg" alt="Issues">
  </a>
  <a href="https://codebeat.co/projects/github-com-andreashuber69-async-css-plugin-develop">
    <img src="https://codebeat.co/badges/8c3c1b09-c029-483a-a812-72e3d9583306" alt="Codebeat Score">
  </a>
  <a href="https://codeclimate.com/github/andreashuber69/async-css-plugin/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/b071b5fbd1aaf7aafbd6/maintainability" alt="Code Climate Maintainability">
  </a>
  <a href="https://codeclimate.com/github/andreashuber69/async-css-plugin/test_coverage">
    <img src="https://api.codeclimate.com/v1/badges/b071b5fbd1aaf7aafbd6/test_coverage" alt="Code Climate Test Coverage">
  </a>
  <a href="https://github.com/andreashuber69/async-css-plugin/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/andreashuber69/async-css-plugin.svg" alt="License">
  </a>
</p>

<h1 align="center">Async CSS Plugin</h1>

Browsers load CSS files (stylesheets) synchronously such that rendering of a page is delayed until all linked
stylesheets have been downloaded. This behavior is typically desired because unstyled HTML is not something you want
your users to see.

However, synchronous CSS loading can also get in the way, namely when a framework like **[Vue](https://vuejs.org)**
bundles your single page application such that all stylesheets are linked in *index.html*, but none of those styles are
necessary to render the page initially. One common example is when *index.html* is designed to quickly show a loading
indicator, then load all required assets in the background to finally transition to the main page when everything is
ready. With synchronous CSS downloads the rendering of the loading indicator can be delayed to the point where e.g. a
mobile user is shown a white screen for many seconds before the indicator finally shows up.

This is where asynchronous CSS loading can lead to a manifold decrease of the time to
[First Paint](https://stackoverflow.com/questions/42209419/time-to-first-paint-vs-first-meaningful-paint) and thus to a
much better perceived responsiveness of your site.

## Prerequisites

This plugin is designed for applications that are built using **[webpack](https://webpack.js.org/)**. More specifically,
your application must satisfy **one** of the following conditions:

- Your application is built using **webpack** directly or a framework that allows for the configuration of **webpack**
  with *[webpack.config.js](https://webpack.js.org/configuration/)*.
- Your application is built using a framework like **[Vue](https://vuejs.org)** that "abstracts away"
  *webpack.config.js* but provides a [different way](https://cli.vuejs.org/guide/webpack.html#chaining-advanced) to
  modify the **webpack** configuration.

## Getting Started

### Installation

`npm install async-css-plugin --save-dev`

### Configuration

`AsyncCssPlugin` configuration depends on how your project is set up, please see [Prerequisites](#Prerequisites) for
more information.

#### webpack.config.js

If your project does not yet contain *[webpack.config.js](https://webpack.js.org/configuration/)*, please create one in
the same folder as *package.json*. Otherwise, please modify accordingly. `AsyncCssPlugin` depends on
[HtmlWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin/), so *webpack.config.js* should minimally look
as follows:

``` js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AsyncCssPlugin = require("async-css-plugin");

module.exports = {
    plugins: [
        new HtmlWebpackPlugin(),
        new AsyncCssPlugin({ /* options */ })
    ]
};
```

#### vue.config.js

If your **Vue** project does not yet contain *[vue.config.js](https://cli.vuejs.org/config/)*, please create one in the same
folder as *package.json*. Otherwise, please adapt accordingly:

``` js
const AsyncCssPlugin = require("async-css-plugin");

module.exports = {
    chainWebpack: config => {
        config.plugin("async-css-plugin").use(AsyncCssPlugin, [{ /* options */ }]);
    }
}
```

By default, **Vue** internally already uses [HtmlWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin/), so
there should be no need to configure that in *vue.config.js*.

## Usage

Once **webpack** is configured as detailed above, stylesheet links in the generated HTML will look similar to the
following:

``` html
<link href=app.cfadf482.css rel=stylesheet media=print onload="this.media='all'">
```

For details on why and how this works, please see
[The Simplest Way to Load CSS Asynchronously](https://www.filamentgroup.com/lab/load-css-simpler/) by the
**filament group**.

As mentioned above, async CSS loading only makes sense when the CSS being loaded **does not** affect the currently
visible page. It is your responsibility to show a different page (e.g. a loading indicator) while this happens, check
out **[Net Worth](https://andreashuber69.github.io/net-worth)** for an example.

## Options

The `AsyncCssPlugin` constructor accepts an (optional)
[Options](https://github.com/andreashuber69/async-css-plugin/blob/develop/src/Options.ts) object.

## Credits

This plugin was inspired by
[async-stylesheet-webpack-plugin](https://github.com/devpreview/async-stylesheet-webpack-plugin).
