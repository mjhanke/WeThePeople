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
  constructor(props) {
    super(props);
    const { bill } = this.props;
    const sponsorName = `${bill.sponsor.first_name} ${bill.sponsor.last_name}`;
    const fbId = bill.sponsor.facebook_id;
    const imageUrl = `https://graph.facebook.com/${fbId}/picture?type=large`;
    const date = '3 days ago  •  Senate';
    const party = ` (${bill.sponsor.party}-${bill.sponsor.state})`;
    const sponsorId = bill.sponsor.id;
    this.state = {
      sponsorName,
      fbId,
      imageUrl,
      date,
      party,
      sponsorId,
    };
  }

  render() {
    const id = this.state.sponsorId;
    return (
      <View style={[styles.header, this.props.style]}>
        <ProfilePic
          imageUrl={this.state.imageUrl}
          wasTapped={this.props.wasTapped(this.state.sponsorId)}
        />
        <View style={styles.nameView}>
          <View>
            <TouchableHighlight
              style={styles.sponsorWrapper}
              underlayColor="white"
              onPress={() => this.props.wasTapped(this.state.sponsorId)}
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

NameHeader.propTypes = {
  bill: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
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
    marginTop: 8,
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
