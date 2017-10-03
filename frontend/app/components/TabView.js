import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Button,
  Alert,
  Image,
  Animated,
  TouchableOpacity
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import {
  TabViewAnimated, TabBar, SceneMap
} from 'react-native-tab-view';
import PropTypes from 'prop-types';

/* Tab bar pages */
import Recent from './Recent'
import MyReps from './MyReps'
import Elections from './Elections'
import BillDetail from './BillDetail'


export default class TabView extends Component {
  static propTypes = {
    toggleDrawer: PropTypes.func.isRequired
  };

  state = {
    index: 0,
    routes: [
      { key: '1', title: 'RECENT' },
      { key: '2', title: 'MY REPS' },
      { key: '3', title: 'ELECTIONS' },
    ],
  };

  _renderScene = SceneMap({
    '1': () => <Recent />,
    '2': () => <MyReps />,
    '3': () => <Elections />,
  });

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => {
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        labelStyle={styles.tabBarLabel}
        style={styles.tabBarHeader}
      />
    );
  };

  constructor(props) {
    super(props);
    this.billWasTapped = this.billWasTapped.bind(this);
  }

  render() {
    return (
      <View style = {styles.container}>
        <TabViewAnimated
          style={styles.container}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={this._renderHeader}
          onIndexChange={this._handleIndexChange}
          lazy={false}
        />
      </View>
    );
  }

  billWasTapped(bill) {
    const { navigate } = this.props.navigation;
    navigate('BillDetail', { bill: bill });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  tabBarHeader: {
    backgroundColor: 'white',
    marginTop: 20,
  },
  tabBarLabel: {
    fontFamily: 'OpenSans-Semibold',
    color: '#222'
  },
  indicator: {
    backgroundColor: 'black'
  }
});

AppRegistry.registerComponent('MainView', () => MainView);
