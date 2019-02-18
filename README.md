# Component Docs

![styled_with linaria](https://img.shields.io/badge/styled_with-linaria-de2d68.svg?style=flat-square)

📝 Simple documentation for your React components.

## Goals

- Simple API with zero-configuration
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

## API

Currently there's no CLI available. You can use the API to generate documentation programmatically.

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

You can also use the server while actively working on documentation. Just replace `build` with `serve` in the above example.

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
