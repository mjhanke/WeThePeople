import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Dimensions,
  ListView,
  Alert,
} from 'react-native';

import CongressAPI from './CongressAPI';
import BillCell from './BillCell';
import LoadingScreen from './LoadingScreen';

export default class Recent extends Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => { true; } });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      fetched: false,
    };
  }

  render() {
    console.log('\nBeginning Recent.js rendering...');
    if (this.state.fetched == false) {
      return (
        <LoadingScreen />
      );
    }
    return (
      <ListView
        style={styles.backgroundView}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
      />
    );
  }

  renderRow(rowData) {
    return (
      <View>
        <BillCell
          bill={rowData}
          billWasTapped={(bill) => { this.billTapHandler(bill); }}
        />
      </View>
    );
  }

  billTapHandler(bill) {
    this.props.billWasTapped(bill);
  }
}

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: '#CFD8DC',
  },
});
