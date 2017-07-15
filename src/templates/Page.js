/* @flow */

import React from 'react';
import Link from './Link';
import { css } from '../lib/styling';
import type { Metadata } from '../types/Metadata';

const wrapper = css`
  display: flex;
  height: 100%;
  flex-direction: column;

  @media(min-width: 640px) {
    flex-direction: row;
  }
`;

const sidebar = css`
  padding: 24px;
  background-color: #262939;
  display: none;

  @media(min-width: 640px) {
    display: block;
    height: 100%;
    width: 240px;
    overflow: auto;
  }
`;

const content = css`
  flex: 1;
  padding: 12px 24px;

  @media(min-width: 640px) {
    height: 100%;
    overflow: auto;
    padding: 24px 48px;
  }
`;

const menuButton = css`
  display: none;

  &:checked ~ nav {
    display: block;
  },

  &:checked ~ label {
    color: #fff;
    opacity: 0.64;
  },

  &:checked ~ label > :first-child {
    display: none;
  },

  &:not(:checked) ~ label > :last-child {
    display: none;
  }
`;

const menuIcon = css`
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  padding: 32px 24px;
  z-index: 10;

  @media(min-width: 640px) {
    display: none;
  }
`;

const separator = css`
  border: 0;
  background-color: #fff;
  height: 1px;
  margin: 8px 0;
  opacity: 0.04;
`;

const link = css`
  display: block;
  padding: 4px 0;
  text-decoration: none;
  opacity: 0.16;

  &:hover {
    opacity: 0.64;
  }

  & code {
    color: #fff;
  }
`;

const active = css`
  opacity: 0.64;
`;

type Props = {
  name: string,
  data: Array<Array<Metadata>>,
  children?: any,
};

export default function Page({ name, data, children }: Props) {
  const links = [];

  data.forEach((items, i) => {
    items.forEach(route =>
      links.push(
        <Link
          key={route.name}
          to={route.name}
          className={`${link} ${name === route.name ? active : ''}`}
        >
          <code>
            {route.title}
          </code>
        </Link>
      )
    );
    if (data[i + 1]) {
      links.push(<hr key={`separator-${i + 1}`} className={separator} />);
    }
  });

  return (
    <div className={wrapper}>
      <input
        className={menuButton}
        id="slide-sidebar"
        type="checkbox"
        role="button"
      />
      <label className={menuIcon} htmlFor="slide-sidebar">
        <span>☰</span>
        <span>✕</span>
      </label>
      <nav className={sidebar}>
        {links}
      </nav>
      <div className={content}>
        {children}
      </div>
    </div>
  );
}
