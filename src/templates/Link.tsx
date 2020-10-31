import * as React from 'react';
import { history } from './Router';

type Props = {
  to: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  children: string;
};

export default class Link extends React.Component<Props> {
  private handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    this.props.onClick && this.props.onClick(event);

    if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
      return;
    }

    event.preventDefault();

    if (!this.props.to) {
      return;
    }

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
  };

  render() {
    const { to, ...rest } = this.props;

    return (
      <a {...rest} href={to ? `${to}.html` : ''} onClick={this.handleClick} />
    );
  }
}
