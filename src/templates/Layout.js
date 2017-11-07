/* @flow */

import React from 'react';
import { css } from '../lib/styling';

type Props = {
  sidebar: React.Element<*>,
  content: React.Element<*>,
};

const wrapper = css`
  display: flex;
  height: 100%;
  flex-direction: column;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

export default function Layout({ sidebar, content }: Props) {
  return (
    <div className={wrapper}>
      {sidebar}
      {content}
    </div>
  );
}
