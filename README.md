# Component Docs

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![MIT License][license-badge]][license]
[![Version][version-badge]][package]
[![Styled with Linaria][linaria-badge]][linaria]

📝 Simple documentation for your React components.

## Goals

- Simple API with minimal configuration
- Fully static, deployable on GitHub pages
- Both server + client routing
- Optimized for mobile screens
- Improved DX with useful features like hot reload
- Supports rendering React Components as well as markdown and MDX files
- Support including markdown from a file reference in markdown files

## Installation

```sh
yarn add --dev component-docs
```

## Configuration

You can specify the configuration using a JavaScript, JSON or YAML file. This can be in form of:

- `component-docs.config.js` JS file exporting the object (recommended).
- `component-docs` property in a `package.json` file.
- `.component-docs` file with JSON or YAML syntax.
- `.component-docs.json`, `.component-docs.yaml`, `.component-docs.yml`, or `.component-docs.js` file.

Example `component-docs.config.js`:

```js
module.exports = {
  port: 1234,
  pages: [
    { type: 'md', file: path.resolve(__dirname, 'index.md') },
    { type: 'md', file: path.resolve(__dirname, 'guide.md') },
  ],
};
```

### Options

The configuration object can contain the following properties:

- `pages` (required): An array of items or a function returning an array of items to show as pages
- `root`: The root directory for the project.
- `output`: Output directory for generated files.
- `assets`: Directories containing the asset files.
- `styles`: Additional CSS files to include in the HTML.
- `scripts`: Additional JS files to include in the HTML.
- `logo`: Logo image from assets to show in sidebar.
- `colors`: Colors to use in the page. This is implemented using CSS variables and falls back to default grey colors on IE.
  - `primary`: Primary color used in highlighted items, links etc.
- `github`: Link to github folder to show edit button.
- `port`: Port to run the server on.
- `open`: Whether to open the browser window.

### Format for pages

Each item in your pages array can contain 3 properties:

- `type` (required): `md` for markdown files, `mdx` for MDX files, `component` to extract component documentation using `react-docgen` or `custom` to render provided file as a React component.
- `file` (required): absolute path to the file.
- `group`: A heading to group this item under. By default, grouping is done for component documentation pages with a dot (`.`) in the name. You can pass `null` here to disable this behavior.

## CLI

To serve docs with your config, run:

```sh
yarn component-docs serve
```

You can also specify a glob of files to use as pages:

```sh
yarn component-docs serve "*.{md,mdx}"
```

The CLI accepts several arguments. See `--help` for details.

## API

If you want to use `component-docs` programmatically, you can use the exported `serve` and `build` functions.

Example:

```js
import path from 'path';
import { build } from 'component-docs';

const pages = [
  { type: 'md', file: '../docs/Get Started.md' },
  { type: 'mdx', file: '../docs/Contributing.mdx' },
  { type: 'separator' },
  { type: 'component', file: '../src/Button.js', }
  { type: 'component', file: '../src/Calendar.js' },
];

build({
  pages: pages.map(page => ({ ...page, file: path.join(__dirname, page.file) })),
  output: path.join(__dirname, 'pages'),
});
```

The `serve` and `build` functions accept the same options object that's used for the configuration file. If a configuration file already exists, the options will be merged.

## Extras

### MDX support

[MDX](https://mdxjs.com/) is a format that lets you seamlessly use JSX in your Markdown documents. This allows you to write your documentation using markdown and have interactive React components inside the documentation.

### File references in Markdown

You can refer to another markdown file and the content of the markdown file will be inlined. When a line starts with a `/` and ends in `.md`, we recognize it as a file reference.

For example:

```md
## Some heading

​/../Details.md

Some more text here.
```

Here, there is a reference to the `../Details.md` file. Its content will be inlined into the markdown file where it's referenced.

### Specifying metadata

Documents can specify metadata such as the page `title`, `description` and `link` to use. The methods vary according to the type of the document.

For markdown documents, metadata can be specified in the YAML front-matter:

```md
---
title: Home
description: This is the homepage.
link: index
---
```

For MDX and React documents, metadata can be exported as a named export named `meta`:

```js
export const meta = {
  title: 'Home',
  description: 'This is the homepage.',
  link: 'index',
};
```

## Example

`component-docs` is used for [react-native-paper](https://callstack.github.io/react-native-paper)

<!-- badges -->

[build-badge]: https://img.shields.io/circleci/project/github/callstack/component-docs/master.svg?style=flat-square
[build]: https://circleci.com/gh/callstack/component-docs
[license-badge]: https://img.shields.io/npm/l/babel-test.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
[version-badge]: https://img.shields.io/npm/v/babel-test.svg?style=flat-square
[package]: https://www.npmjs.com/package/babel-test
[linaria-badge]: https://img.shields.io/badge/styled_with-linaria-de2d68.svg?style=flat-square
[linaria]: https://github.com/callstack/linaria
