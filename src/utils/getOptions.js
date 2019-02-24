/* eslint-disable no-nested-ternary */
/* @flow */

import path from 'path';
import cosmiconfig from 'cosmiconfig';

import type { Options } from '../types';

const explorer = cosmiconfig('component-docs');

export default function getOptions(
  overrides: Options
): { ...$Exact<Options>, root: string, output: string, port: number } {
  /* $FlowFixMe */
  const root: string = overrides.root
    ? path.isAbsolute(overrides.root)
      ? overrides.root
      : path.join(process.cwd(), overrides.root || '')
    : process.cwd();

  const result: { config?: $Shape<Options> } = explorer.searchSync(root);
  const options = {
    port: 3031,
    output: 'dist',
    ...(result ? result.config : null),
    ...overrides,
  };

  options.root = root;
  options.output = path.isAbsolute(options.output)
    ? options.output
    : path.join(root, options.output);

  ['assets', 'styles', 'scripts'].forEach(t => {
    options[t] = options[t]
      ? options[t].map(name =>
          path.isAbsolute(name) ? name : path.join(root, name)
        )
      : undefined;
  });

  return options;
}
