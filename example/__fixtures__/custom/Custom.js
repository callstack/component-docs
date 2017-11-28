/* @flow */
/* eslint-disable jsx-a11y/accessible-emoji */

import * as React from 'react';

export default class Custom extends React.Component<{}> {
  static meta = {
    title: 'Custom 🎉',
    description: 'Custom React Component',
    permalink: 'custom-component',
  };

  render() {
    return (
      <div style={{ padding: 24, fontSize: 24 }}>🌹 🌻 🌷 🌿 🌵 🌾 🌼⁣</div>
    );
  }
}
