/* eslint-disable react/no-unused-prop-types */

import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Buttons communicate the action that will occur when the user touches them
 *
 * <div class="screenshots">
 *    <img src="screenshots/button-raised.png" />
 *    <img src="screenshots/button-primary.png" />
 *    <img src="screenshots/button-custom.png" />
 * </div>
 *
 * ### Usage
 * ```js
 * const MyComponent = () => (
 *   <Button raised onPress={() => console.log('Pressed')}>
 *     Press me
 *   </Button>
 * );
 * ```
 */
export default class Button extends Component {
  static propTypes = {
    /**
     * Disable the button
     */
    disabled: PropTypes.bool,
    /**
     * Use to primary color from theme
     */
    primary: PropTypes.bool,
    /**
     * Button text
     */
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    /**
     * Function to execute on press
     */
    onPress: PropTypes.func,
    style: PropTypes.any,
  };

  render() {
    return null;
  }
}
