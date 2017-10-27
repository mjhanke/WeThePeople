import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  TabViewAnimated, TabBar, SceneMap,
} from 'react-native-tab-view';
import PropTypes from 'prop-types';

/* Tab bar pages */
import Recent from './Recent';
import MyReps from './MyReps';
import CongressFeed from './CongressFeed';

export default class TabView extends Component {
  static propTypes = {
    toggleDrawer: PropTypes.func.isRequired,
  };

  state = {
    index: 0,
    routes: [
      { key: '1', title: 'CONGRESS' },
      //{ key: '2', title: 'STATE' },
      { key: '3', title: 'MY REPS' },
    ],
  };

  handleIndexChange = index => this.setState({ index });

  renderHeader = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      labelStyle={styles.tabBarLabel}
      style={styles.tabBarHeader}
    />
  );

  renderScene = SceneMap({
    1: () => (
      <CongressFeed
        billWasTapped={this.props.billWasTapped}
        personWasTapped={this.props.personWasTapped}
      />
    ),
    2: () => <Recent />,
    3: () => (
      <MyReps
        voterAddress={this.props.voterAddress}
      />
    ),
  });

  render() {
    return (
      <View style={styles.container}>
        <TabViewAnimated
          style={styles.container}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderHeader={this.renderHeader}
          onIndexChange={this.handleIndexChange}
          lazy={false}
        />
      </View>
    );
  }
}

TabView.propTypes = {
  billWasTapped: PropTypes.func.isRequired,
  personWasTapped: PropTypes.func.isRequired,
  voterAddress: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabBarHeader: {
    backgroundColor: 'white',
    marginTop: 20,
  },
  tabBarLabel: {
    fontFamily: 'OpenSans-Semibold',
    color: '#222',
  },
  indicator: {
    backgroundColor: 'black',
  },
});
