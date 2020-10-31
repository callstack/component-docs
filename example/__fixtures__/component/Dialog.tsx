/* eslint-disable class-methods-use-this, react/no-unused-prop-types,  @typescript-eslint/no-unused-vars */

import * as React from 'react';
import DialogButton from './DialogButton';
import DialogList from './DialogList';

type Props = {
  /**
   * Image to show in dialog.
   */
  source: { uri: string };
  /**
   * Callback to trigger on press.
   */
  onPress: () => void;
  children: React.ReactNode;
  /**
   * @internal
   */
  siblings: string[];
  /**
   * @optional
   */
  theme: any;
  style?: any;
};

/**
 * Dialog allows you to show information in a dialog.
 *
 * **Usage:**
 * ```js
 * export default class MyComponent extends React.Component {
 *   state = {
 *     // Whether dialog is visible
 *     visible: false,
 *   };
 *
 *   _showDialog = () => this.setState({ visible: true });
 *
 *   _hideDialog = () => this.setState({ visible: false });
 *
 *   render() {
 *     const { visible } = this.state;
 *
 *     return (
 *       <View>
 *         <Button onPress={this._showDialog}>Show Dialog</Button>
 *         <Dialog
 *           visible={visible}
 *           onRequestClose={this._hideDialog}
 *         >
 *           <Dialog.Title>Alert</Dialog.Title>
 *           <Dialog.Content>
 *             <Paragraph>This is a simple dialog</Paragraph>
 *           </Dialog.Content>
 *           <Dialog.Actions>
 *             <Button onPress={this._hideDialog}>Done</Button>
 *           </Dialog.Actions>
 *         </Dialog>
 *       </View>
 *     );
 *   }
 * }
 * ```
 */
export default class Dialog extends React.Component<Props> {
  /**
   * Duration for showing the dialog.
   */
  static DURATION: number = 300;

  /**
   * Builder can be used to build dialogs.
   */
  static Builder(description: string) {
    return null;
  }

  /**
   * Static prop that allows you to access DialogButton as Dialog.Button
   */
  static Button = DialogButton;

  /**
   * Static prop that allows you to access DialogList as Dialog.List
   */
  static List = DialogList;

  /**
   * Show the dialog
   */
  show(animated: boolean, duration: number): Promise<void> {
    return Promise.resolve();
  }

  private animate() {}

  render() {
    return null;
  }
}
