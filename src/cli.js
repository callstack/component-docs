/* @flow */
/* eslint-disable import/first */

import './babel-register';

import path from 'path';
import chalk from 'chalk';
import glob from 'glob';
import ora from 'ora';
import yargs from 'yargs';
import { serve, build } from './index';

const { argv } = yargs
  .usage('Usage: $0 <command> [options] [files...]')
  .options({
    root: {
      type: 'string',
      description: 'The root directory for the project',
      requiresArg: true,
    },
    output: {
      type: 'string',
      description: 'Output directory for generated files',
      requiresArg: true,
    },
    assets: {
      type: 'array',
      description: 'Directories containing the asset files',
      requiresArg: true,
    },
    styles: {
      type: 'array',
      description: 'Additional CSS files to include in the HTML',
      requiresArg: true,
    },
    scripts: {
      type: 'array',
      description: 'Additional JS files to include in the HTML',
      requiresArg: true,
    },
    logo: {
      type: 'string',
      description: 'Logo image from assets to show in sidebar',
      requiresArg: true,
    },
    github: {
      type: 'string',
      description: 'Link to github folder to show edit button',
      requiresArg: true,
    },
  })
  .command('serve', 'serve pages for development', y => {
    y.options({
      port: {
        type: 'number',
        description: 'Port to run the server on',
        requiresArg: true,
      },
      open: {
        type: 'boolean',
        description: 'Whether to open the browser window',
      },
    });
  })
  .command('build', 'build pages for deploying')
  .demandCommand()
  .epilogue('See $0 <command> --help for more information')
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
  const spinner = ora('Building pages…').start();

  build(argv).then(
    ({ stats, options }) => {
      spinner.succeed(
        `Successfully built pages in ${chalk.bold(
          String(stats.endTime - stats.startTime)
        )}ms (${chalk.blue(path.relative(process.cwd(), options.output))})`
      );
    },
    e => spinner.fail(`Failed to build pages ${e.message}`)
  );
} else {
  serve(argv);
}
