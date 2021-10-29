import * as React from 'react';

type Props = {
  source: { uri: string };
  onPress: () => unknown;
  style?: any;
};

/**
 * Link allows to visit a remote URL on tap
 *
 * **Usage:**
 * ```js
 * const MyComponent = () => (
 *   <Link source={{ uri: 'callstack.com' }}>
 *     Press me
 *   </Link>
 * );
 * ```
 */
export default class Link extends React.Component<Props> {
  render() {
    return null;
  }
}
