import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableHighlight,
} from 'react-native';

/* Library for handling dates and times */
const moment = require('moment');

import CongressAPI from './CongressAPI';
import We from '../images/We.png';

export default class BillCell extends Component {
  componentWillMount() {
    this.state = {
      sponsor: 'Loading...',
      imageUrl: 'hello',
    }
    var url = this.props.bill.sponsor.bioguide_id;
    CongressAPI.getLegislator(url)
      .then((response) => {
          this.state = {
            sponsor: response.first_name + ' ' + response.last_name,
            imageUrl: 'https://graph.facebook.com/' + response.facebook_account
              + '/picture?type=large',
            party: response.current_party,
            state: response.roles[0].state,
            opacity: 0,
          };
          this.forceUpdate();
      })
  }
  render() {
    if (this.props.bill === 'This is the first card') {
      return (
        <View style = {styles.welcomeCard}>
          <Text style = {styles.welcomeText}>
            {'Welcome!'}
          </Text>
          <Text style = {[styles.welcomeSubText]}>
            {'Below are bills introduced in the Senate\n'}
          </Text>
        </View>
      );
    }
    else {
      styles.cardView.height = topic = getTopic(this.props.bill);
      const details = getContent(this.props.bill);
      const date = moment(this.props.bill.latest_major_action_date).format('YYYY-MM-DD');
      const relativeDate = moment(date).fromNow();
      const party = ' (' + this.state.party + '-' + this.state.state + ')';
      const sponsor = this.state.sponsor.replace('&#39;', '').replace('&#39;', '')
      return (
      <TouchableHighlight
        underlayColor = 'white'
        onPress= {() => {
          console.log("******origin tapped******");
          this.props.billWasTapped(this.props.bill);
        }
        }>
        <View style = {styles.cardView}>
          <View style = {styles.header}>
            <Image
              style = {styles.profilePic}
              source = {{uri: this.state.imageUrl.toString()}}
            />
            <View style = {styles.nameView}>
              <View>
                <Text style = {styles.sponsorWrapper}>
                  <Text style = {styles.sponsor}>
                    {sponsor}
                  </Text>
                  <Text style = {styles.party}>
                    {party}
                  </Text>
                </Text>
              </View>
              <Text style = {styles.date}>
                {relativeDate}
              </Text>
            </View>
          </View>
          <Text style = {styles.content} numberOfLines={2}>
            {details}
          </Text>
        </View>
        </TouchableHighlight>
        );
      }

    }
}

let styles = StyleSheet.create({
  cardView: {
    height: 150,
    marginRight: 7,
    marginLeft: 7,
    marginTop: 7,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  welcomeCard: {
    height: 120,
    marginRight: 7,
    marginLeft: 7,
    marginTop: 7,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  welcomeText: {
    flex: 1,
    marginTop: 20,
    fontFamily: 'OpenSans-Light',
    fontSize: 22,
  },
  welcomeSubText: {
    flex: 2,
    marginTop: 20,
    fontFamily: 'OpenSans-Light',
    fontSize: 18,
    color: '#424242',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    //backgroundColor: 'green'
    //backgroundColor: '#FF6F00',
  },
  content: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,
    //backgroundColor: 'yellow',
    fontFamily: 'OpenSans-Light',
  },
  date: {
    marginTop: 5,
    marginLeft: 10,
    fontSize: 14,
    color: 'grey',
  },
  nameView: {
    flexDirection: 'column',
    //backgroundColor: 'magenta'
  },
  sponsorWrapper: {
    marginTop: 15,
    marginLeft: 10,
  },
  sponsor: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
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
    //backgroundColor: 'green',
    textAlign: 'right',
  },
  profilePic: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginTop: 10,
    marginLeft: 10,
    backgroundColor: 'gray',
    borderWidth: 0.5,
  },
});

/* Returns reader-friendly topic of bill */
function getTopic(bill) {
  var topic;
  if (bill.primary_subject === '') {
    topic = bill.committees
      .replace(new RegExp('Senate '), '')
      .replace(new RegExp(' Committee'), '');
  }
  else {
    topic = bill.primary_subject;
  }
  topic = topic
    .replace(new RegExp(' and.*'), '')
    .replace(new RegExp(",.*"), "")
    .replace(new RegExp('&#39;'), '');
  return topic;
}

function getContent(bill) {
  var content =
  capitalizeFirstLetter(
    bill.title
    .replace(new RegExp('(A bill )'), '')
    .replace(new RegExp('(to )'), '')
    .replace(new RegExp('(A resolution )'), '')
    .replace(new RegExp('(A joint resolution )'), '')
  );

  if (content[content.length - 1]== '.') {
    content = content.slice(0, -1);
  }
  return content;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
