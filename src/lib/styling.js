/* @flow */

import stylis from 'stylis';
import hash from 'short-hash';

let sheet = '';

const named = (name?: string = 'css', filename: ?string = null) => (
  template: Array<string>,
  ...expressions: Array<string>
) => {
  const styles = template.reduce(
    (accumulator, part, i) => accumulator + expressions[i - 1] + part
  );

  const slug = hash(filename || styles);
  const classname = `${name}__${slug}`;
  const selector = `.${classname}`;
  const rules = stylis(selector, styles);

  sheet += `${rules}\n`;

  return classname;
};

export const css = named();

css.named = named;

export function dump() {
  return sheet;
}
