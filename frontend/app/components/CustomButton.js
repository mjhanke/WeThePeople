/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';

const THEME_COLOR = '#489AF0';
const PAGE_WIDTH = Dimensions.get('window').width;

export default class CustomButton extends Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor={THEME_COLOR}
        activeOpacity={0.5}
        onPress={this.props.onPress}
      >
        <View>
          <Text style={styles.buttonText}>
            {this.props.text}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

CustomButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: '#489AF0',
    marginLeft: 15,
    marginRight: 15,
    alignItems: 'center',
    borderRadius: 30,
    width: PAGE_WIDTH - 30,
    marginBottom: 15,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    margin: 12,
    color: 'white',
  },
  onboarding: {
    // These styles are used on the onboarding page
    position: 'absolute',
    bottom: 50,
    marginTop: 35,
    marginBottom: 10,
  },
});
