/* @flow */
/* eslint-disable jsx-a11y/accessible-emoji */

import * as React from 'react';
import Content from './Content';
import Link from './Link';
import type { PageInfo } from '../types';

type Props = {
  data: PageInfo[],
};

export default class Fallback extends React.Component<Props> {
  render() {
    return (
      <Content>
        <h1>Page not found.</h1>
        <p>
          Looks like the page you requested doesn&#39;t exist. You can try
          selecting one of the available pages shown below.
        </p>
        <p>This error page is shown only during development.</p>
        <ul>
          {this.props.data.map(item => (
            <li key={item.link}>
              <Link to={item.link}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </Content>
    );
  }
}
