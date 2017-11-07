/* @flow */
/* eslint-disable react/no-unused-prop-types */

import * as React from 'react';

type Props = {
  source: { uri: string },
  onPress: () => mixed,
  style?: any,
};

/**
 * Link allows to visit a remote URL on tap
 *
 * **Usage:**
 * ```
 * const MyComponent = () => (
 *   <Link source={{ uri: 'callstack.com' }}>
 *    Press me
 *   </Link>
 * );
 * ```
 */
export default class Button extends React.Component<Props> {
  render() {
    return null;
  }
}
