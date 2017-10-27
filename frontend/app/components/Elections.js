import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Animated,
  Dimensions,
  Image,
} from 'react-native';

export default class Elections extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Hello!
        </Text>
        <Text style={styles.instructions}>
          {"We're hard at work on this feature. Stay tuned!"}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#CFD8DC',
  },
  welcome: {
    marginTop: 30,
    fontSize: 30,
    fontFamily: 'OpenSans-Light',
    textAlign: 'center',
    margin: 10,
    marginRight: 10,
    marginLeft: 10,
  },
  instructions: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'OpenSans-Light',
    color: '#333333',
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 10,
  },
});
