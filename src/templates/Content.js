/* @flow */

import * as React from 'react';
import { css } from 'linaria';

const container = css`
  flex: 1;

  @media (min-width: 640px) {
    height: 100%;
    overflow: auto;
  }
`;

const content = css`
  padding: 24px;

  @media (min-width: 640px) {
    padding: 24px 48px;
  }
`;

type Props = {
  children?: any,
};

export default function Content({ children }: Props) {
  return (
    <div className={container}>
      <div className={content}>{children}</div>
    </div>
  );
}
