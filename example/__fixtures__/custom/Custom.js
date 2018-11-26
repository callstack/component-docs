/* @flow */
/* eslint-disable jsx-a11y/accessible-emoji */

import * as React from 'react';
import { css } from 'linaria';

const container = css`
  padding: 24px;
  font-size: 24px;
`;

export default class Custom extends React.Component<{}> {
  static meta = {
    title: 'Custom 🎉',
    description: 'Custom React Component',
    link: 'custom-component',
  };

  render() {
    return <div className={container}>🌹 🌻 🌷 🌿 🌵 🌾 🌼⁣</div>;
  }
}
