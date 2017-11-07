/* @flow */

import fs from 'fs';
import { dump } from './lib/styling';
import reset from './styles/reset.css';
import globals from './styles/globals.css';
import prism from './styles/prism.css';

export default function buildCSS({ sheet }: { sheet: string }) {
  const data = `
${reset}
${globals}
${prism}
${dump()}
`;

  fs.writeFileSync(sheet, data);
}
