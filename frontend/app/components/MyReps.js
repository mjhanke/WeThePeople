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
  componentWillMount() {
    const address = this.props.voterAddress;
    CivicAPI.getRepresentatives(address).then(response => this.parseReps(response));
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => { true; } });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      fetched: false,
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
        renderRow={this.renderRow}
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
    // Match politicians with their offices
    const reps = response.officials;
    if (reps !== undefined) {
      const positions = [];
      const offices = response.offices;
      for (const i in offices) {
        const office = offices[i];
        const officeName = office.name.replace(/(Senate)/g, 'Senator');
        for (const j in office.officialIndices) {
          const index = office.officialIndices[j];
          reps[index].position = officeName;
        }
      }
      const repsWithoutPresident = reps.filter(rep => this.isNotPresident(rep));

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(repsWithoutPresident),
        fetched: true,
      });
    }
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
