import * as React from 'react';
import type { PageInfo } from '../types';
import Content from './Content';
import Link from './Link';

type Props = {
  logo?: string;
  data: PageInfo[];
};

export default class Fallback extends React.Component<Props> {
  render() {
    return (
      <Content logo={this.props.logo}>
        <h1>Page not found.</h1>
        <p>
          Looks like the page you requested doesn&#39;t exist. You can try
          selecting one of the available pages shown below.
        </p>
        <p>This error page is shown only during development.</p>
        <ul>
          {this.props.data.map((item) => (
            <li key={item.link}>
              <Link to={item.link}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </Content>
    );
  }
}
