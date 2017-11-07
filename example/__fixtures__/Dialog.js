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
 * export default class MyComponent extends React.Component {
 *  state = {
 *   visible: false,
 *  };
 *
 *  _showDialog = () => this.setState({ visble: true });
 *  _hideDialog = () => this.setState({ visble: false });
 *
 *  render() {
 *   const { visible } = this.state;
 *   return (
 *     <View>
 *       <Button onPress={this._showDialog}>Show Dialog</Button>
 *       <Dialog
 *          visible={visible}
 *          onRequestClose={this._hideDialog}
 *       >
 *         <Dialog.Title>Alert</Dialog.Title>
 *         <Dialog.Content>
 *           <Paragraph>This is simple dialog</Paragraph>
 *         </Dialog.Content>
 *         <Dialog.Actions>
 *          <Button onPress={this._hideDialog}>Done</Button>
 *          </Dialog.Actions>
 *       </Dialog>
 *     </View>
 *   );
 *  }
 * }
 * ```
 */
export default class Button extends React.Component<Props> {
  render() {
    return null;
  }
}
