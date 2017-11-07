/* @flow */

import * as React from 'react';
import { css } from '../lib/styling';

const content = css`
  flex: 1;
  padding: 24px;

  @media (min-width: 640px) {
    height: 100%;
    overflow: auto;
    padding: 24px 48px;
  }
`;

type Props = {
  children?: any,
};

export default function Content({ children }: Props) {
  return <div className={content}>{children}</div>;
}
