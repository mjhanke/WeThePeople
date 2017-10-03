import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Button,
  Image,
  Dimensions,
} from 'react-native';

import colors from '../assets/colors.json'

export default class WelcomeScreen extends Component {
  render() {
    return (
      <Image
        style = {styles.container}
        source = {require('../images/golden-gate-withlogo.png')}
      >
      <TouchableHighlight
        style = {styles.footer}
        onPress = {this.onPressContinueButton}
      >
        <View style = {styles.buttonBackground}>
          <Text style = {styles.buttonText}>
            {'Let\'s get started'}
          </Text>
        </View>
      </TouchableHighlight>
      </Image>
    );
  }
  onPressContinueButton() {

  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    resizeMode: 'cover',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  buttonText: {
    height: 100,
    width: Dimensions.get('window').width,
    fontSize: 25,
    color: 'black',
    backgroundColor: 'transparent',
    fontFamily: 'OpenSans-Light',
    textAlign: 'center',
    marginTop: 6,
  },
  buttonBackground: {
    height: 60,
    width: Dimensions.get('window').width - 24,
    backgroundColor: 'white',
    borderRadius: 35,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 24,
  },
});

AppRegistry.registerComponent('WelcomeScreen', () => WelcomeScreen);
