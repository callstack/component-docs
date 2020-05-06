/* @flow */

import * as React from 'react';
import { styled } from 'linaria/react';
import ThemeToggle from './ThemeToggle';

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 55, 0.08);
`;

export default function Header() {
  return (
    <HeaderWrapper>
      <ThemeToggle />
    </HeaderWrapper>
  );
}
