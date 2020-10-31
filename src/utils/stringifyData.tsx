import type { Separator, Metadata } from '../types';

export default function stringifyData(
  data: Array<Metadata | Separator>
): string {
  return `module.exports = [
  ${data
    .map((item) =>
      item.type === 'mdx' || item.type === 'custom'
        ? item.stringify()
        : JSON.stringify(item)
    )
    .join(',')}
]`;
}
