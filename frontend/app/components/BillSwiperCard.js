/* @flow */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import NameHeader from './NameHeader';

export default class BillSwiperCard extends Component {
  render() {
    return (
      <View style={styles.card}>
        <NameHeader
          bill={this.props.bill}
          wasTapped={this.props.personWasTapped}
          style={styles.header}
        />
        <Text style={styles.title}>
          {this.props.bill.title}
        </Text>
        <View style={styles.divider} />
        <Text
          style={styles.summary}
        >
          {this.props.bill.machine_summary.join('\n\n')}
        </Text>
        <Text style={styles.summaryHeader}>
          Auto-generated summary
        </Text>
        <Text style={styles.readMoreButton}>
          Read more
        </Text>
      </View>
    );
  }
}

BillSwiperCard.propTypes = {
  bill: PropTypes.object.isRequired,
  personWasTapped: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: 'white',
    shadowColor: '#494F54',
    shadowOffset: {
      width: 4,
      height: 8,
    },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    margin: 10,
    elevation: 2,
  },
  header: {
    height: 85,
    borderRadius: 15,
    // backgroundColor: 'magenta',
  },
  title: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    margin: 15,
    marginTop: -8,
    color: '#1F222A',
    // backgroundColor: 'green',
  },
  summaryHeader: {
    fontFamily: 'OpenSans-LightItalic',
    margin: 15,
    marginTop: 0,
    fontSize: 14,
    color: 'gray',
    // backgroundColor: 'green',
    textAlign: 'left',
  },
  divider: {
    height: 0.75,
    backgroundColor: '#CFD8DC',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
  summary: {
    flex: -1,
    margin: 15,
    marginTop: 0,
    fontSize: 15,
    // backgroundColor: 'red',
    fontFamily: 'OpenSans-Regular',
    color: '#1F222A',
  },
  readMoreButton: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    marginBottom: 15,
    color: '#489AF0',
    textAlign: 'center',

  },
});
