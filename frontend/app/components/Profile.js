import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import CongressAPI from './CongressAPI';

export default class Profile extends Component {
  static navigationOptions = {
    headerStyle: {backgroundColor: 'transparent'}
  };

  componentWillMount() {
    const { params } = this.props.navigation.state;

  }

  render() {

    return (
      <ScrollView
        style = {styles.backgroundView}
        contentContainerStyle = {styles.scrollViewContent}>
        <View style = {styles.cardView}>
        <View style = {styles.nameView}>
          <Image
            style = {styles.profilePic}
            source = {{uri: 'https://graph.facebook.com/SenatorToddYoung/picture?type=large'}}
          />
        </View>
          <Text style = {styles.name}>
            Rob Portman
          </Text>
          <Text style = {styles.title}>
            United States Senator
          </Text>
          <View style = {styles.stats}>
            {this._renderBadge('10', 'yrs XP')}
            {this._renderBadge('R', 'party')}
            {this._renderBadge('MI', 'state')}
          </View>
          <Text style = {styles.bio}>
            Robert Jones Portman is an American lawyer and the junior United States Senator from Ohio, and a member of the Republican Party.
          </Text>
        </View>
        <View style = {styles.gradientView}>
          <ImageBackground
            style = {styles.gradient}
            source = {require('../images/ideology_gradient.png')}
          >
            <View style = {styles.ideologyIndicator} />
          </ImageBackground>
          <View style = {styles.ideologyLabelView}>
            <Text style = {styles.ideologyLabel}>
              Liberal
            </Text>
            <Text style = {styles.ideologyLabel}>
              Conservative
            </Text>
          </View>
        </View>

      </ScrollView>
    );
  }

  _renderBadge(text, label) {
    return (
      <View style = {styles.expView}>
        <Text style = {styles.experience}>
          {text}
        </Text>
        <View style = {styles.expLabelView}>
          <Text style = {styles.expLabel}>
            {label}
          </Text>
        </View>
      </View>
    )
  }

}

let styles = StyleSheet.create({
  cardView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'white',
    margin: 9,
    marginTop: 120,
  },
  name: {
    flex: 2,
    backgroundColor: 'white',
    fontFamily: 'OpenSans-Semibold',
    textAlign: 'center',
    fontSize: 27,
    marginBottom: 5,
  },
  nameView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    backgroundColor: 'white',
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    fontSize: 20,
    color: 'gray'
  },
  profilePic: {
    flex: 5,
    height: 150,
    width: 150,
    marginTop: -75,
    marginBottom: 15,
    borderRadius: 75,
    borderColor: 'gray',
    backgroundColor: 'gray',
    borderWidth: 2,
  },
  stats: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
  expView: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 32.5,
    borderWidth: 1,
    height: 65,
    width: 65,
    borderColor: 'gray',
  },
  expLabel: {
    color: 'white',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  expLabelView: {
    height: 20,
    width: 60,
    borderRadius: 9,
    marginBottom: -6,
    backgroundColor: 'gray',
  },
  experience: {
    flex: 1,
    borderRadius: 32.5,
    height: 65,
    width: 65,
    color: 'gray',
    textAlign: 'center',
    marginTop: 12,
    backgroundColor: 'transparent',
    fontFamily: 'OpenSans-Semibold',
    fontSize: 25,
  },
  bio: {
    marginLeft: 15,
    marginRight: 15,
    margin: 15,
    fontFamily: 'OpenSans-Regular',
    fontSize: 17,
  },
  gradientView: {
    flex: -1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'white',
    margin: 9,
    marginTop: 0,
  },
  gradient: {
    flex: 1,
    height: 15,
    width: (Dimensions.get('window').width) - 36,
    marginLeft: 9,
    marginRight: 9,
    marginTop: 9,
  },
  ideologyLabelView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    marginTop: 5,
  },
  ideologyLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: 'gray'
  },
  ideologyIndicator: {
    height: 30,
    width: 5,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'magenta',
    marginTop: -7,
    marginLeft: 300,
  }
});
