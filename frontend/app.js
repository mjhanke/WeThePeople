import React from 'react';
import {
  AppRegistry,
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import codePush from 'react-native-code-push';
import { Client } from 'bugsnag-react-native';
/* Welcome screens */
import MainView from './app/components/MainView';
import BillDetail from './app/components/BillDetail';

export default class WeThePeople extends React.Component {
  constructor(props) {
    super(props);
    if (!__DEV__) {
      // Initialize Bugsnag bug tracking in production
      const bugsnag = new Client();
    }
  }
  render() {
    return (
      <Navigator screenProps={this.props} />
    );
  }
}

const Navigator = StackNavigator({
  MainView: { screen: MainView, navigationOptions: { header: null } },
  BillDetail: { screen: BillDetail },
});

WeThePeople = codePush(WeThePeople);

AppRegistry.registerComponent('WeThePeople', () => WeThePeople);
