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
    let address = this.props.voterAddress;
    CivicAPI.getRepresentatives(address).then(
      (response) => this.parseReps(response));
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {true}});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      fetched: false
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
    return(
      <MyRepsCell
        person = {rowData}
      />
    );
  }

  parseReps(response) {
    // Match politicians with their offices
    let reps = response['officials'];
    let positions = [];
    let offices = response['offices'];
    for (let i in offices) {
      let office = offices[i];
      let officeName = office['name'].replace(/(Senate)/g, 'Senator');
      for (let j in office['officialIndices']) {
        let index = office['officialIndices'][j];
        reps[index].position = officeName;
      }
    }

    let repsWithoutPresident = reps.filter((rep) => this.isNotPresident(rep));

    this.state = {
      dataSource: this.state.dataSource.cloneWithRows(repsWithoutPresident),
      fetched: true
    };
    this.forceUpdate();
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
