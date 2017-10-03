import React, { Component } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native'

export default class ControlPanel extends Component {
  render() {
    let {closeDrawer} = this.props
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.controlText}>The Control Panel is under construction. Be sure to check back later!</Text>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  controlText: {
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
  icon: {
    flexGrow: 1,
    width: 60,
    height: 60,
    marginTop: 24,
    marginBottom: 12,
  },
})
