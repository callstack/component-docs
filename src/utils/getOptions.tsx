import path from 'path';
import { cosmiconfigSync } from 'cosmiconfig';
import type { Options } from '../types';

const explorer = cosmiconfigSync('component-docs');

export default function getOptions(
  overrides: Options
): Options & {
  root: string;
  output: string;
  port: number;
} {
  const root: string = overrides.root
    ? path.isAbsolute(overrides.root)
      ? (overrides.root as any)
      : path.join(process.cwd(), overrides.root || '')
    : process.cwd();

  const result: { config?: Partial<Options> } | null = explorer.search(root);
  const options = {
    port: 3031,
    output: 'dist',
    ...(result ? result.config : null),
    ...overrides,
    root,
  };

  options.output = path.isAbsolute(options.output)
    ? options.output
    : path.join(root, options.output);

  (['assets', 'styles', 'scripts'] as const).forEach((t) => {
    options[t] = options[t]
      ? options[t]?.map((name: string) =>
          path.isAbsolute(name) ? name : path.join(root, name)
        )
      : undefined;
  });

  return options;
}
