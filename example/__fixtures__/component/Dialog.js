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
  render() {
    return null;
  }
}
