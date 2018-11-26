/* @flow */

import { Component } from 'react';
import createHistory from 'history/createBrowserHistory';
import type { Route } from '../types';

type Props = {
  path: string,
  routes: Array<Route>,
};

type State = {
  path: string,
};

// eslint-disable-next-line import/no-mutable-exports
export let history: any;

try {
  history = createHistory();
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
    if (prevState.path !== this.state.path) {
      const route = this.props.routes.find(r => r.link === this.state.path);
      if (route) {
        document.title = route.title || '';
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
