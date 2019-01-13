/* @flow */

import * as React from 'react';
import { css } from 'linaria';

type Props = {
  children: React.Node,
};

const wrapper = css`
  display: flex;
  height: 100%;
  flex-direction: column;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

export default function Layout({ children }: Props) {
  return <div className={wrapper}>{children}</div>;
}
