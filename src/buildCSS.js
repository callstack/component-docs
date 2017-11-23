/* @flow */

import CleanCSS from 'clean-css';
import { dump } from './lib/styling';
import reset from './styles/reset.css';
import globals from './styles/globals.css';

export default function buildCSS({
  minify,
}: {
  output: string,
  minify?: boolean,
}) {
  const data = `
${reset}
${globals}
${dump()}
`;

  return minify ? new CleanCSS({}).minify(data).styles : data;
}
