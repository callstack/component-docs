/* @flow */

import { Component } from 'react';
import { createBrowserHistory } from 'history';
import type { Route } from '../types';

type Props = {
  path: string,
  routes: Array<Route>,
  title?: string,
};

type State = {
  path: string,
};

// eslint-disable-next-line import/no-mutable-exports
export let history: any;

try {
  history = createBrowserHistory();
} catch (e) {
  history = null;
}

export default class Router extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      path: history ? this._parse(history.location.pathname) : props.path,
    };
  }

  state: State;

  componentDidMount() {
    this._unlisten = history.listen(location =>
      this.setState({
        path: this._parse(location.pathname),
      })
    );
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { routes, title } = this.props;
    if (prevState.path !== this.state.path) {
      const route = routes.find(r => r.link === this.state.path);
      if (route) {
        // eslint-disable-next-line no-undef
        document.title = title
          ? title.replace(/\[title\]/g, route.title)
          : route.title || '';
      }
    }
  }

  componentWillUnmount() {
    this._unlisten();
  }

  props: Props;

  _parse = (pathname: string) =>
    pathname
      .split('/')
      .pop()
      .split('.')[0] || 'index';

  _unlisten: () => void;

  render() {
    const route = this.props.routes.find(r => r.link === this.state.path);

    if (route) {
      return route.render({
        ...route.props,
        path: this.state.path,
      });
    }

    return null;
  }
}
