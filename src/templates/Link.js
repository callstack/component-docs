/* @flow */

import React, { Component } from 'react';
import { history } from './Router';

type Props = {
  to: string,
  onClick?: Function,
};

export default class Router extends Component<Props, void> {
  props: Props;

  _handleClick = (event: MouseEvent) => {
    event.preventDefault();
    const path = `${this.props.to}.html`;
    try {
      if (history) {
        history.push(path);
      } else {
        throw new Error('');
      }
    } catch (e) {
      if (!e.message.startsWith("Failed to execute 'pushState' on 'History'")) {
        // Google Chrome throws for file URLs
        throw e;
      }
      const { pathname } = window.location;
      if (pathname.endsWith('/')) {
        window.location.pathname = `${pathname}/${path}`;
      } else {
        const parts = pathname.split('/');
        parts.pop();
        window.location.pathname = `${parts.join('/')}/${path}`;
      }
    }

    this.props.onClick && this.props.onClick(event);
  };

  render() {
    const { to, ...rest } = this.props;

    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a {...rest} href={`${to}.html`} onClick={this._handleClick} />;
  }
}
