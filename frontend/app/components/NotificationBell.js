import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableHighlight,
} from 'react-native';

export default class NotificationBell extends Component {
  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View>
          <Image
            style={styles.icon}
            resizeMode="cover"
            source={require('../images/Bell.png')}
          />
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    flexGrow: 1,
    width: 34,
    height: 34,
    marginLeft: 12,
    marginRight: 12,
  },
});
