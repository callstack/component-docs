/* @flow */

import React from 'react';
import { style } from 'glamor';
import Link from './Link';
import type { Metadata } from '../types/Metadata';

const wrapper = style({
  display: 'flex',
  height: '100%',
  flexDirection: 'column',

  '@media(min-width: 640px)': {
    flexDirection: 'row',
  },
});

const sidebar = style({
  padding: '24px',
  backgroundColor: '#262939',
  display: 'none',

  '@media(min-width: 640px)': {
    display: 'block',
    height: '100%',
    width: '240px',
    overflow: 'auto',
  },
});

const content = style({
  flex: 1,
  padding: '12px 24px',

  '@media(min-width: 640px)': {
    height: '100%',
    overflow: 'auto',
    padding: '24px 48px',
  },
});

const menuButton = style({
  display: 'none',

  '&:checked ~ nav': {
    display: 'block',
  },

  '&:checked ~ label': {
    color: '#fff',
    opacity: 0.64,
  },

  '&:checked ~ label > :first-child': {
    display: 'none',
  },

  '&:not(:checked) ~ label > :last-child': {
    display: 'none',
  },
});

const menuIcon = style({
  fontSize: '24px',
  lineHeight: 1,
  cursor: 'pointer',
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '32px 24px',
  zIndex: 10,

  '@media(min-width: 640px)': {
    display: 'none',
  },
});

const separator = style({
  border: 0,
  backgroundColor: '#fff',
  height: '1px',
  margin: '8px 0',
  opacity: 0.04,
});

const link = style({
  display: 'block',
  padding: '4px 0',
  textDecoration: 'none',
  opacity: 0.16,

  ':hover': {
    opacity: 0.64,
  },

  '& code': {
    color: '#fff',
  },
});

const active = style({
  opacity: 0.64,
});

type Props = {
  name: string;
  data: Array<Array<Metadata>>;
  children?: any;
}

export default function Page({ name, data, children }: Props) {
  const links = [];

  data.forEach((items, i) => {
    items.forEach(route => links.push(
      <Link
        key={route.name}
        to={route.name}
        {...link}
        {...(name === route.name ? active : null)}
      >
        <code>{route.title}</code>
      </Link>
    ));
    if (data[i + 1]) {
      links.push(<hr key={`separator-${i + 1}`} {...separator} />);
    }
  });

  return (
    <div {...wrapper}>
      <input
        {...menuButton}
        id='slide-sidebar'
        type='checkbox'
        role='button'
      />
      <label {...menuIcon} htmlFor='slide-sidebar'>
        <span>☰</span>
        <span>✕</span>
      </label>
      <nav {...sidebar}>
        {links}
      </nav>
      <div {...content}>
        {children}
      </div>
    </div>
  );
}
