import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
/* Welcome screens */
import MainView from './app/components/MainView'
import WelcomeScreen from './app/components/WelcomeScreen'
import BillDetail from './app/components/BillDetail'
import Elections from './app/components/Elections'

const WeThePeople = StackNavigator({
  MainView: { screen: MainView, navigationOptions: { header: null }},
  BillDetail: { screen: BillDetail },
});

AppRegistry.registerComponent('WeThePeople', () => WeThePeople);
