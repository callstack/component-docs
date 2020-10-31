import fs from 'fs';
import path from 'path';
import dashify from 'dashify';
import frontmatter from 'front-matter';
import getNameFromPath from '../utils/getNameFromPath';
import type { Metadata } from '../types';

export default function md(
  filepath: string,
  { root }: { root: string }
): Metadata {
  let text = fs.readFileSync(filepath, 'utf-8');

  const dependencies: string[] = [];

  // Inline file references
  text = text
    .split('\n')
    .map((line) => {
      if (/^\/.+\.md$/.test(line)) {
        const f = path.join(path.dirname(filepath), line);
        const result = md(f, { root });

        dependencies.push(...result.dependencies, f);

        return result.data;
      }
      return line;
    })
    .join('\n');

  // Load YAML frontmatter
  const { body: data, attributes: meta } = frontmatter<{
    title?: string;
    description?: string;
    link?: string;
  }>(text);

  const title = meta.title || getNameFromPath(filepath);

  return {
    filepath: path.relative(root, filepath),
    title,
    description: meta.description || '',
    link: meta.link || dashify(title),
    data,
    type: 'md',
    dependencies,
  };
}
