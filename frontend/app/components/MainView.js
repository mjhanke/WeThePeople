import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  AppRegistry,
} from 'react-native';

import TabView from './TabView';

export default class MainView extends Component {
  billWasTapped(bill) {
    const { navigate } = this.props.navigation;
    navigate('BillDetail', { bill });
  }
  render() {
    return (
      <TabView
        billWasTapped={(bill) => { this.billWasTapped(bill); }}
        toggleDrawer={() => { this.toggleDrawer(); }}
        voterAddress={this.props.screenProps.voterAddress}
      />
    );
  }
}

MainView.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  screenProps: PropTypes.shape({
    voterAddress: PropTypes.string.isRequired,
  }).isRequired,
};

AppRegistry.registerComponent('MainView', () => MainView);
