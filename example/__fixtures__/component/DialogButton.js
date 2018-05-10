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
 * Dialog.Button allows you to add buttons in a dialog.
 */
export default class DialogButton extends React.Component<Props> {
  static displayName = 'Dialog.Button';

  render() {
    return null;
  }
}
