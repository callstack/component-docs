/* @flow */

import { Component } from 'react';
import createHistory from 'history/createBrowserHistory';
import type { Route } from '../types';

type Props = {
  name: string,
  routes: Array<Route>,
};

type State = {
  name: string,
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
      name: history ? this._parse(history.location.pathname) : props.name,
    };
  }

  state: State;

  componentDidMount() {
    this._unlisten = history.listen(location =>
      this.setState({
        name: this._parse(location.pathname),
      })
    );
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevState.name) {
      const route = this.props.routes.find(r => r.name === this.state.name);
      if (route && route.title) {
        document.title = route.title;
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

  _unlisten: Function;

  render() {
    const route = this.props.routes.find(r => r.name === this.state.name);

    if (route) {
      return route.render({
        ...route.props,
        name: this.state.name,
      });
    }

    return null;
  }
}
