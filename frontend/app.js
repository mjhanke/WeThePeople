import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import codePush from "react-native-code-push";
/* Welcome screens */
import MainView from './app/components/MainView';
import WelcomeScreen from './app/components/WelcomeScreen';
import BillDetail from './app/components/BillDetail';
import Elections from './app/components/Elections';
import Profile from './app/components/Profile';

class WeThePeople extends React.Component {
  render() {
    console.log('this.props in WeThePeople', this.props); // This will list the initialProps.

    // StackNavigator **only** accepts a screenProps prop so we're passing
    // initialProps through that.
    return <Navigator screenProps={this.props} />;
  }
}

const Navigator = StackNavigator({
  MainView: { screen: MainView, navigationOptions: { header: null }},
  BillDetail: { screen: BillDetail },
});

WeThePeople = codePush(WeThePeople);

AppRegistry.registerComponent('WeThePeople', () => WeThePeople);
