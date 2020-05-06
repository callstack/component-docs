/* @flow */

import * as React from 'react';
import { styled } from 'linaria/react';
import ThemeToggle from './ThemeToggle';

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 55, 0.08);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: flex-end;
`;

const LogoImage = styled.img`
  display: block;
  height: 24px;
  width: auto;
`;

type Props = {
  logo?: string,
};

export default function Header({ logo }: Props) {
  return (
    <HeaderWrapper>
      <LogoContainer>
        {logo ? <LogoImage src={logo} alt="Logo" /> : null}
      </LogoContainer>
      <ThemeToggle />
    </HeaderWrapper>
  );
}
