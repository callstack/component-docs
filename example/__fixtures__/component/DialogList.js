/* @flow */
/* eslint-disable class-methods-use-this, no-unused-vars, react/no-unused-prop-types */

import * as React from 'react';
import Button from './Button';

type Props = {
  /**
   * Callback to trigger on press.
   */
  onPress: () => mixed,
};

/**
 * Dialog.List allows you to add lists in a dialog.
 */
export default class DialogList extends React.Component<Props> {
  static displayName = 'Dialog.List';

  render() {
    return null;
  }
}
