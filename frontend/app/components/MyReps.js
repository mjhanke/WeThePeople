import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ListView,
} from 'react-native';

import CivicAPI from './CivicAPI';
import MyRepsCell from './MyRepsCell';
import LoadingScreen from './LoadingScreen';

export default class MyReps extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => { true; } });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      fetched: false,
      error: null,
    };
    const address = '1341 Geddes Ave';
    CivicAPI.getRepresentatives(address).then(response => this.parseReps(response));
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
        renderRow={this.renderRow}
        enableEmptySections
      />
    );
  }

  renderRow(rowData) {
    return (
      <MyRepsCell
        person={rowData}
      />
    );
  }

  parseReps(response) {
    this.setState({ fetched: true });
    if (response.error && response.error.message) {
      this.setState({
        error,
      });
      return;
    }
    // Match politicians with their offices
    const reps = response.officials;
    const positions = [];
    const offices = response.offices;
    offices.forEach((office) => {
      const officeName = office.name.replace(/(Senate)/g, 'Senator');
      const indices = office.officialIndices;
      indices.forEach((index) => {
        reps[index].position = officeName;
      });
    });
    const repsWithoutPresident = reps.filter(rep => this.isNotPresident(rep));

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(repsWithoutPresident),
      fetched: true,
    });
  }

  isNotPresident(rep) {
    return !rep.position.includes('President of the United States');
  }

  bindFunctions() {
    this.parseReps = this.parseReps.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }
}

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: '#CFD8DC',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#CFD8DC',
  },
  welcome: {
    marginTop: 30,
    fontSize: 30,
    fontFamily: 'OpenSans-Light',
    textAlign: 'center',
    margin: 10,
    marginRight: 10,
    marginLeft: 10,
  },
  instructions: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'OpenSans-Light',
    color: '#333333',
    marginBottom: 5,
    marginRight: 10,
    marginLeft: 10,
  },
});
