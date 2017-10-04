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
import LoadingScreen from './LoadingScreen'
import sampleBill from '../assets/sampleGpoBill.json'

export default class Recent extends Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {true}});

    this.state = {
      dataSource: ds.cloneWithRows([sampleBill]),
      fetched: true
    };
  }

  render() {
    if (this.state.fetched == false) {
      return (
        <LoadingScreen />
      );
    }
    return (
      <ListView
        style={styles.backgroundView}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}>
      </ListView>
    );
  }

  renderRow(rowData) {
    return (
      <View>
      <BillCell
        bill={rowData}
        billWasTapped = {(bill) => {this.billTapHandler(bill)}} />
      </View>
    );
  }

  billTapHandler(bill) {
    this.props.billWasTapped(bill)
  }
}

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: '#CFD8DC',
  },
  floatingButton: {
    backgroundColor: '#ff5722',
    borderColor: '#ff5722',
    borderWidth: 1,
    height: 100,
    width: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right:20,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  }
});
