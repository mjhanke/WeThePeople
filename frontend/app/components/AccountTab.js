/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default class AccountTab extends Component {
  render() {
    return (
      <View style={styles.card}>
        <Text style={styles.welcomeText}>
          {'Welcome! \n\nYou\'re currently signed in.'}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 15,
    backgroundColor: 'white',
    elevation: 4,
    borderRadius: 15,
  },
  welcomeText: {
    margin: 15,
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
});
