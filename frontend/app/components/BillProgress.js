import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';

import images from '../assets/images';
import BillProgressItem from './BillProgressItem.js';

export default class BillProgress extends Component {
  render() {
    return (
      <View style={styles.shadow}>
        <View style={styles.progressView}>
          <BillProgressItem
            image={images.podium}
            text="Introduced"
            color="green"
          />
          <BillProgressItem
            image={images.lightCheckmark}
            text="Passed by House"
            color="#BDBDBD"
          />
          <BillProgressItem
            image={images.lightCheckmark}
            text="Passed by Senate"
            color="#BDBDBD"
          />
          <BillProgressItem
            image={images.pen}
            text="Signed by President"
            color="#BDBDBD"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  progressView: {
    //backgroundColor: 'yellow',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    margin: 7,
    marginTop: 0,
    marginBottom: 35,
    height: 65,
    width: Dimensions.get('window').width - 30 - 14,

  },
  shadow: {
    
    shadowColor: '#494F54',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 0.7,
    shadowOpacity: 0.8,
    height: 90,
    marginBottom: 10,
    borderRadius: 10,
  }
});
