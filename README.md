API

```js
import path from 'path';
import { build } from 'component-docs';

const files = [
  [
    'README.md',
    'Getting Started.md',
  ],
  [
    './src/Button.js',
    './src/Calendar.js',
  ],
];

build({
  files,
  output: path.join(__dirname, 'dist'),
});

