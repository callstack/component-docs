import { styled } from 'linaria/react';

const Layout = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

export default Layout;
