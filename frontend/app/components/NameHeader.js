import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableHighlight,
  StyleSheet,
  AppRegistry,
  Text,
} from 'react-native';
import ProfilePic from './ProfilePic';

export default class NameHeader extends Component {
  render() {
    return (
      <View style={[styles.header, this.props.style]}>
        <ProfilePic
          imageUrl={this.props.imageUrl}
          wasTapped={() => this.props.wasTapped(this.props.legId)}
        />
        <View style={styles.nameView}>
          <View>
            <TouchableHighlight
              style={styles.sponsorWrapper}
              underlayColor="white"
              onPress={() => this.props.wasTapped(this.props.legId)}
            >
              <Text>
                <Text style={styles.sponsor}>
                  {this.props.name}
                </Text>
                <Text style={styles.party}>
                  {this.props.party}
                </Text>
              </Text>
            </TouchableHighlight>
          </View>
          <Text style={styles.date}>
            {this.props.date}
          </Text>
        </View>
      </View>
    );
  }
}

ProfilePic.propTypes = {
  wasTapped: PropTypes.func.isRequired,
};

let styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'white',
    // backgroundColor: 'green'
    // backgroundColor: '#FF6F00',
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
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    // backgroundColor: 'yellow',
  },
  sponsor: {
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold',
  },
  party: {
    fontSize: 18,
    fontFamily: 'OpenSans-Light',
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


AppRegistry.registerComponent('ProfilePic', () => ProfilePic);
