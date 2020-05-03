/* eslint-disable react/no-unused-prop-types */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Buttons communicate the action that will occur when the user touches them
 *
 * @SnackPlayer Button.SimpleUsage.js
 *
 * @extends TouchableWithoutFeedback props https://facebook.github.io/react-native/docs/touchablewithoutfeedback.html#props
 */
export default class Button extends Component {
  static propTypes = {
    /**
     * Whether to disable the button.
     */
    disabled: PropTypes.bool,
    /**
     * Whether to use to primary color from theme.
     */
    primary: PropTypes.bool,
    /**
     * Content of the button.
     */
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    /**
     * Function to execute on press.
     */
    onPress: PropTypes.func,
    style: PropTypes.any,
  };

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
