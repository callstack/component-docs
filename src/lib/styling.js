/* @flow */

import stylis from 'stylis';
import hash from 'short-hash';

let sheet = '';

export function dump() {
  return sheet;
}

export function css(template: Array<string>, ...expressions: Array<string>) {
  const styles = template.reduce(
    (accumulator, part, i) => accumulator + expressions[i - 1] + part
  );

  const slug = `css-${hash(styles)}`;
  const selector = `.${slug}`;
  const rules = stylis(selector, styles);

  sheet += rules + '\n';

  return slug;
}
