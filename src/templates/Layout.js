/* @flow */

import * as React from 'react';
import { css } from 'linaria';
import type { Metadata, Separator } from '../types';

type Props = {
  path: string,
  data: Array<Metadata | Separator>,
  Sidebar: React.ComponentType<*>,
  Content: React.ComponentType<*>,
  children?: React.Node,
};

const wrapper = css`
  display: flex;
  height: 100%;
  flex-direction: column;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

export default function Layout({
  path,
  data,
  children,
  Sidebar,
  Content,
}: Props) {
  return (
    <div className={wrapper}>
      <Sidebar path={path} data={data} />
      <Content>{children}</Content>
    </div>
  );
}
