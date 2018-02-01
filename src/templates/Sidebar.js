/* @flow */

import * as React from 'react';
import { css } from 'linaria';
import Link from './Link';
import type { Metadata, Separator } from '../types';

const sidebar = css`
  background-color: #fafafa;
  box-shadow: 0 0.5px 1.5px rgba(0, 0, 0, 0.32);

  @media (min-width: 640px) {
    height: 100%;
    min-width: 240px;
    overflow: auto;
  }
`;

const navigation = css`
  padding: 24px;
`;

const menu = css`
  display: none;

  @media (min-width: 640px) {
    display: block;
  }
`;

const menuIcon = css`
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  padding: 16px;
  z-index: 10;
  -webkit-tap-highlight-color: transparent;

  @media (min-width: 640px) {
    display: none;
  }
`;

const menuButton = css`
  display: none;

  &:checked ~ .${menu} {
    display: block;
  }

  &:checked ~ label {
    color: #111;
    user-select: none;
  }
`;

const searchbar = css`
  appearance: none;
  width: 100%;
  padding: 16px 48px 16px 24px;
  font-size: 1em;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.08);
  background-color: white;
  outline: 0;

  @media (min-width: 640px) {
    padding: 12px 24px;
  }
`;

const separator = css`
  border: 0;
  background-color: rgba(0, 0, 0, 0.05);
  height: 1px;
  margin: 8px 0;
`;

const link = css`
  display: block;
  padding: 8px 0;
  text-decoration: none;
  color: #888;

  &:hover {
    color: #111;
  }
`;

const active = css`
  color: #333;
  -webkit-text-stroke-color: currentColor;
  -webkit-text-stroke-width: 1px;
`;

type Props = {
  path: string,
  data: Array<Metadata | Separator>,
};

type State = {
  query: string,
  open: boolean,
};

export default class Sidebar extends React.Component<Props, State> {
  state = {
    query: '',
    open: false,
  };

  render() {
    const { path, data } = this.props;
    const mapper = (item, i) => {
      if (item.type === 'separator') {
        return <hr key={`separator-${i + 1}`} className={separator} />;
      }

      return (
        <Link
          key={item.path}
          to={item.path}
          className={`${link} ${path === item.path ? active : ''}`}
          onClick={() => this.setState({ open: false, query: '' })}
        >
          {item.title}
        </Link>
      );
    };

    const links = this.state.query
      ? data
          .filter(item => {
            if (item.type === 'separator') {
              return false;
            }

            return item.title
              .toLowerCase()
              .includes(this.state.query.toLowerCase());
          })
          .map(mapper)
      : data.map(mapper);

    return (
      <div className={sidebar}>
        <input
          className={menuButton}
          id="slide-sidebar"
          type="checkbox"
          role="button"
          checked={this.state.open}
          onChange={e => this.setState({ open: e.target.checked })}
        />
        <label className={menuIcon} htmlFor="slide-sidebar">
          ☰
        </label>
        <div className={menu}>
          <input
            type="search"
            value={this.state.query}
            onChange={e => this.setState({ query: e.target.value })}
            placeholder="Filter…"
            className={searchbar}
          />
          <nav className={navigation}>{links}</nav>
        </div>
      </div>
    );
  }
}
