import React, { Component } from 'react';

import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
} from 'react-native';

import images from '../assets/images'

 export default class LoadingScreen extends Component {
  render() {
     return (
       <View style = {styles.backgroundView}>
         <View style = {styles.loadingContainer}>
           <Image
             source = {images.hamster}
             style = {styles.loadingIcon}
           />
           <Text style = {styles.loadingText}t>
             Loading...
           </Text>
         </View>
       </View>
     );
   }
}

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: '#CFD8DC',
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    marginTop: Dimensions.get('window').width / 4,
  },
  loadingIcon: {
    flex: 2,
    //backgroundColor: 'cyan',
    resizeMode: 'contain',
  },
  loadingText: {
    flex: 3,
    marginTop: 15,
    alignSelf: 'center',
    fontFamily: 'OpenSans-Light',
    fontSize: 24,
  }
});
