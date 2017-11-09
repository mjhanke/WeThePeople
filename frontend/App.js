/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import firebase from 'react-native-firebase';
import Onboarding from './app/components/Onboarding';
import PhoneAuth from './app/components/PhoneAuth';
import MainView from './app/components/MainView';
import BillDetail from './app/components/BillDetail';
import ProfilePage from './app/components/ProfilePage';

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
    this.state = {
      userIsFetched: false,
      userIsLoggedIn: false,
    };
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        userIsFetched: true,
        userIsLoggedIn: (user != null),
      });
    });
  }

  render() {
    //firebase.auth().signOut();
    if (this.state.userIsFetched && this.state.userIsLoggedIn) {
      return (
        <LoggedInUserNavigator />
      );
    }
    if (this.state.userIsFetched && !this.state.userIsLoggedIn) {
      return (
        <FirstTimeUserNavigator />
      );
    }
    return (
      <View />
    );
  }
}

const FirstTimeUserNavigator = StackNavigator({
  Onboarding: { screen: Onboarding, navigationOptions: { header: null } },
  PhoneAuth: { screen: PhoneAuth, navigationOptions: { header: null } },
});

const LoggedInUserNavigator = StackNavigator({
  MainView: { screen: MainView, navigationOptions: { header: null } },
  BillDetail: { screen: BillDetail },
  ProfilePage: { screen: ProfilePage },
});
