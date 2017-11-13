import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ListView,
  AsyncStorage,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import TabView from './TabView';

export default class AddressEntry extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {"Where's home?"}
          </Text>
          <Text style={styles.description}>
            View {this.props.prevComponent.state.viewStatement}!
          </Text>
        </View>
        { GooglePlacesInput(this.props.prevComponent) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CFD8DC',
    alignItems: 'stretch',
  },
  title: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Light',
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 10,
    backgroundColor: 'white',
  },
  description: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Light',
    fontSize: 20,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  header: {
    marginTop: 7,
    backgroundColor: 'white',
  }
});


const GooglePlacesInput = (prevComponent) => {
  return (
    <GooglePlacesAutocomplete
      placeholder='Search'
      minLength={2} // minimum length of text to search
      autoFocus={false}
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      listViewDisplayed='auto'    // true/false/undefined
      fetchDetails={true}
      renderDescription={row => row.description} // custom description render
      onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
        console.log('Address Entered:', data['description']);
        prevComponent.updateAddress(data['description']);
      }}

      getDefaultValue={() => ''}

      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: 'AIzaSyCB6aXTmzrnPaGK4SO9lX2_p12Ve5iE8pY',
        language: 'en', // language of the results
        types: 'geocode' // default: 'geocode'
      }}

      styles={{
        textInputContainer: {
          width: '100%'
        },
        description: {
          fontWeight: 'bold'
        },
        predefinedPlacesDescription: {
          color: '#1faadb'
        }
      }}

      // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
      // currentLocationLabel="Current location"
      nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={{
        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
      }}
      GooglePlacesSearchQuery={{
        // // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        // rankby: 'distance',
        // types: 'food'
      }}

      // filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      // predefinedPlaces={[homePlace, workPlace]}

      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      // renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
      // renderRightButton={() => <Text>Custom text after the input</Text>}
    />
  );
}
