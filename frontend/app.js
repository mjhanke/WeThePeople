import React from 'react';
import {
  AppRegistry,
  AsyncStorage,
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import codePush from 'react-native-code-push';
import { Client } from 'bugsnag-react-native';
/* Welcome screens */
import MainView from './app/components/MainView';
import BillDetail from './app/components/BillDetail';
import ProfilePage from './app/components/ProfilePage';

export default class WeThePeople extends React.Component {
  constructor(props) {
    super(props);
    if (!__DEV__) {
      // Initialize Bugsnag bug tracking in production
      const bugsnag = new Client();
    }
    this.saveSelectedTopics();
  }

  async saveSelectedTopics() {
    if (this.props.hasOwnProperty('subtopics')) {
      const topics = this.props['subtopics'];
      try {
        AsyncStorage.setItem('@MySuperStore:topics',
          JSON.stringify(topics)).then(() => {
            this.fetchTopics();
          })
      } catch (error) {
        console.log('error saving topics');
      }
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
  ProfilePage: { screen: ProfilePage },
});

WeThePeople = codePush(WeThePeople);

AppRegistry.registerComponent('WeThePeople', () => WeThePeople);
