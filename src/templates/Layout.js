/* @flow */

import React from 'react';
import { css } from '../lib/styling';

type Props = {
  Sidebar: ReactClass<*>,
  Content: ReactClass<*>,
};

const wrapper = css`
  display: flex;
  height: 100%;
  flex-direction: column;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

export default function Layout({ Sidebar, Content }: Props) {
  return (
    <div className={wrapper}>
      <Sidebar />
      <Content />
    </div>
  );
}
