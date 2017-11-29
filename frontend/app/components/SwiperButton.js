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

const PAGE_WIDTH = Dimensions.get('window').width;

export default class SwiperButton extends Component {
  render() {
    return (
      <TouchableHighlight
        style={[styles.button, {
          backgroundColor: this.props.color,
        }]}
        underlayColor={this.props.color}
        activeOpacity={0.5}
        onPress={this.props.onPress}
      >
        <View>
          <Text style={[styles.buttonText]}>
            {this.props.text}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

SwiperButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  button: {
    marginTop: 15,
    alignItems: 'center',
    borderRadius: 10,
    width: (PAGE_WIDTH / 2) - 30,
    height: 55,
    marginBottom: 15,
    elevation: 3,
    // backgroundColor: 'blue',
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: 20,
    margin: 12,
    color: 'white',
    // backgroundColor: 'blue',
  },
  onboarding: {
    // These styles are used on the onboarding page
    position: 'absolute',
    bottom: 50,
    marginTop: 35,
    marginBottom: 10,
  },
});
