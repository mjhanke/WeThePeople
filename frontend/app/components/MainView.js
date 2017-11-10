import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TabView from './TabView';

export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.billWasTapped = this.billWasTapped.bind(this);
    this.personWasTapped = this.personWasTapped.bind(this);
  }
  billWasTapped(bill) {
    const { navigate } = this.props.navigation;
    navigate('BillDetail', { bill, personWasTapped: this.personWasTapped });
  }
  personWasTapped(legId) {
    const { navigate } = this.props.navigation;
    navigate('ProfilePage', { legId });
  }
  render() {
    return (
      <TabView
        billWasTapped={bill => this.billWasTapped(bill)}
        personWasTapped={bill => this.personWasTapped(bill)}
        toggleDrawer={() => this.toggleDrawer()}
        navigation={this.props.navigation}
      />
    );
  }
}

MainView.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
