/* @flow */

import * as React from 'react';
import { styled } from 'linaria/react';
import Markdown from './Markdown';
import Minimap from './Minimap';

type Props = {
  source: string,
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const MarkdownContent = styled(Markdown)`
  flex: 1;
`;

export default function MarkdownPage({ source }: Props) {
  // Hacky logic to extract headings
  const headings: string[] =
    source
      .split('```')
      .reduce((content, block, i) => {
        // Remove all code blocks
        if (i % 2) {
          return content;
        }

        return content + block;
      }, '')
      .match(/^#{1,3}\s.+$/gm) || [];

  const { map } = headings.reduce(
    (acc, heading) => {
      const level = heading.match(/^#+/)[0].length;
      const title = heading.replace(/^#+\s+/, '').replace(/(<([^>]+)>)/g, '');
      const href = `#${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

      switch (level) {
        case 2: {
          const data = { href, map: {} };
          acc.map[title] = data;
          acc.last = data;
          break;
        }
        case 3:
          if (acc.last) {
            acc.last.map[title] = href;
          }
      }

      return acc;
    },
    { map: {} }
  );

  return (
    <Row>
      <MarkdownContent source={source} />
      <Minimap map={map} />
    </Row>
  );
}
