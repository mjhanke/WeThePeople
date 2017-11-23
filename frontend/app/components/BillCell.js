import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';
import NameHeader from './NameHeader';

export default class BillCell extends Component {
  componentWillMount() {
    this.setState({
      details: this.props.bill.title,
    });
  }

  render() {
    return (
      <TouchableHighlight
        underlayColor="white"
        onPress={() => this.props.billWasTapped(this.props.bill)}
      >
        <View style={styles.cardView}>
          <NameHeader
            bill={this.props.bill}
            wasTapped={this.props.personWasTapped}
          />
          <Text style={styles.content} numberOfLines={2}>
            {this.state.details}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

BillCell.propTypes = {
  billWasTapped: PropTypes.func.isRequired,
  personWasTapped: PropTypes.func.isRequired,
  bill: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
};

let styles = StyleSheet.create({
  cardView: {
    height: 140,
    marginRight: 7,
    marginLeft: 7,
    marginTop: 7,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'white',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    // backgroundColor: 'green'
    // backgroundColor: '#FF6F00',
  },
  content: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,
    // backgroundColor: 'yellow',
    fontFamily: 'OpenSans-Regular',
  },
  date: {
    marginTop: 5,
    marginLeft: 10,
    fontSize: 14,
    color: 'grey',
  },
  nameView: {
    flexDirection: 'column',
    // backgroundColor: 'magenta'
  },
  sponsorWrapper: {
    marginTop: 15,
    marginLeft: 10,
  },
  sponsor: {
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold',
  },
  party: {
    fontSize: 18,
    fontFamily: 'OpenSans-Light',
  },
  topic: {
    marginTop: 5,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    fontSize: 16,
    // backgroundColor: 'green',
    textAlign: 'right',
  },
  profilePic: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginTop: 10,
    marginLeft: 10,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'gray',
  },
});
