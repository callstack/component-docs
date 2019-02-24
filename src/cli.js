/* @flow */

import '@babel/register';
import glob from 'glob';
import ora from 'ora';
import yargs from 'yargs';
import { serve, build } from './index';

const { argv } = yargs
  .usage('Usage: $0 [options] <build|serve> <...files>')
  .option('root', {
    type: 'string',
    description: 'The root directory for the project',
    requiresArg: true,
  })
  .option('output', {
    type: 'string',
    description: 'Output directory for generated files',
    requiresArg: true,
  })
  .option('assets', {
    type: 'array',
    description: 'Directories containing the asset files',
    requiresArg: true,
  })
  .option('styles', {
    type: 'array',
    description: 'Additional CSS files to include in the HTML',
    requiresArg: true,
  })
  .option('scripts', {
    type: 'array',
    description: 'Additional JS files to include in the HTML',
    requiresArg: true,
  })
  .option('logo', {
    type: 'string',
    description: 'Logo image from assets to show in sidebar',
    requiresArg: true,
  })
  .option('github', {
    type: 'string',
    description: 'Link to github folder to show edit button',
    requiresArg: true,
  })
  .option('port', {
    type: 'number',
    description: 'Port to run the server on',
    requiresArg: true,
  })
  .option('open', {
    type: 'boolean',
    description: 'Whether to open the browser window',
  })
  .alias('help', 'h')
  .alias('version', 'v')
  .strict();

const [command, ...files] = argv._;

if (files.length) {
  argv.pages = () => {
    const result = files.reduce(
      (acc, pattern) => [...acc, ...glob.sync(pattern, { absolute: true })],
      []
    );

    return result.map(file => ({
      type: file.endsWith('mdx') ? 'mdx' : 'md',
      file,
    }));
  };
}

if (command === 'build') {
  const spinner = ora('Building files…').start();

  build(argv).then(
    stats => {
      spinner.succeed('Successfully built files');
      console.log(
        stats.toString({
          colors: true,
          all: false,
          modules: true,
          errors: true,
        })
      );
    },
    e => spinner.fail(`Failed to build files ${e.message}`)
  );
} else {
  serve(argv);
}
