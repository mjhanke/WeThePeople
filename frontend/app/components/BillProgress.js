import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';

import images from '../assets/images'
import BillProgressItem from './BillProgressItem.js'

 export default class BillProgress extends Component {
  render() {
     return (
       <View style = {styles.progressView}>
            <BillProgressItem
              image = {images.podium}
              text = {'Introduced'}
              color = {'green'}/>
            <BillProgressItem
              image = {images.lightCheckmark}
              text = {'Passed by House'}
              color = {'#BDBDBD'}/>
            <BillProgressItem
              image = {images.lightCheckmark}
              text = {"Passed by Senate"}
              color = {'#BDBDBD'}/>
            <BillProgressItem
              image = {images.pen}
              text = {'Signed by President'}
              color = {'#BDBDBD'}/>
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
    margin: 15,
    marginTop: 0,
    marginBottom: 35,
    height: 65,
    width: Dimensions.get('window').width - 30 - 14,
 },
});
