/* @flow */

import * as React from 'react';
import { styled } from 'linaria/react';

const Container = styled.nav`
  position: sticky;
  top: 0;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  margin-left: 20px;
  padding-left: 5px;
  min-width: 200px;
  font-size: 95%;
`;

const List = styled.ul`
  margin-left: 0;
  padding-left: 15px;
  list-style: none;
`;

const ListItem = styled.li`
  margin: 5px 0;

  & > ul {
    margin-top: 5px;
    margin-bottom: 15px !important;
  }

  a {
    color: currentColor;
    text-decoration: none;
    opacity: 0.5;

    &:focus,
    &:hover {
      opacity: 1;
    }
  }
`;

type Map = {
  [key: string]: { href: string, map: { [key: string]: string } } | void,
};

type Props = {
  map: Map,
};

export default function Minimap({ map }: Props) {
  return (
    <Container>
      <List>
        {Object.keys(map).map(label => {
          if (map[label]) {
            return (
              <ListItem key={label}>
                <a href={map[label].href}>{label}</a>
                {map[label].map && Object.keys(map[label].map).length ? (
                  <List>
                    {Object.keys(map[label].map).map(l => (
                      <ListItem key={l}>
                        <a href={map[label].map[l]}>{l}</a>
                      </ListItem>
                    ))}
                  </List>
                ) : null}
              </ListItem>
            );
          }
        })}
      </List>
    </Container>
  );
}
