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
        <Text>Welcome! This page is currently under construction</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 30,
    marginBottom: 280,
    backgroundColor: 'white',
    elevation: 4,
    borderRadius: 15,
  },
});
