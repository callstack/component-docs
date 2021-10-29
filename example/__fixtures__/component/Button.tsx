import * as React from 'react';

type Props = {
  /**
   * Whether to disable the button.
   */
  disabled?: boolean;
  /**
   * Whether to use to primary color from theme.
   */
  primary?: boolean;
  /**
   * Content of the button.
   */
  children: string | Array<string>;
  /**
   * Function to execute on press.
   */
  onPress?: Function;
  style?: any;
};

/**
 * Buttons communicate the action that will occur when the user touches them
 *
 * <div class="screenshots">
 *   <img src="screenshots/button-raised.png" />
 *   <img src="screenshots/button-primary.png" />
 *   <img src="screenshots/button-custom.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * const MyComponent = () => (
 *   <Button raised onPress={() => console.log('Pressed')}>
 *     Press me
 *   </Button>
 * );
 * ```
 * @extends TouchableWithoutFeedback props https://facebook.github.io/react-native/docs/touchablewithoutfeedback.html#props
 */
export default class Button extends React.Component<Props> {
  static defaultProps = {
    disabled: false,
  };

  static getDerivedStateFromProps() {
    return null;
  }

  state = {};

  render() {
    return <button>{this.props.children}</button>;
  }
}
