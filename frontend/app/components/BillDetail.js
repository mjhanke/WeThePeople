import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import CongressAPI from './CongressAPI';
import BillProgress from './BillProgress';
import NameHeader from './NameHeader';
import Emoji from './Emoji';
import CustomButton from './CustomButton';
import images from '../assets/images';

export default class BillDetail extends Component {
  static navigationOptions = {
    headerStyle: { backgroundColor: 'white' },
  };

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const { sponsor } = params.bill;
    let imageUrl = '';
    if ('facebook_id' in params.bill.sponsor) {
      const facebookId = params.bill.sponsor.facebook_id;
      imageUrl = `https://graph.facebook.com/${facebookId}/picture?type=large`;
    } else {
      imageUrl = params.bill.sponsor.picture_url;
    }
    this.state = {
      billExcerpts: '',
      sponsor: `${sponsor.first_name} ${sponsor.last_name} `,
      bill: params.bill,
      imageUrl,
      legId: '',
      personWasTapped: params.personWasTapped,
    };

    const legislatorId = params.bill.sponsor.id;
    CongressAPI.getLegislator(legislatorId)
      .then((response) => {
        this.setState({
          imageUrl: `https://graph.facebook.com/${response.facebook_account}/picture?type=large`,
          party: `(${response.current_party}-${response.roles[0].state})`,
          legId: response.member_id,
        });
      });
  }

  renderMachineSummary() {
    let textToShowUser = this.state.bill.machine_summary.join('\n\n');
    if (textToShowUser === '') {
      textToShowUser = 'Currently unavailable';
    }
    return (
      <Text style={styles.summary}>
        {textToShowUser}
      </Text>
    );
  }

  renderHumanSummary() {
    const textToShowUser = this.state.bill.human_summary.join('\n\n');
    if (textToShowUser !== '') {
      return (
        <View>
          <Text style={styles.summaryHeader}>
            {'Human Summary'}
          </Text>
          <Text style={styles.summary}>
            {textToShowUser}
          </Text>
        </View>

      );
    }
    return null;
  }

  render() {
    const details = this.state.bill.title;
    const subject = this.state.bill.topic;
    const date = this.state.bill.introduction_date;
    const relativeDate = this.state.bill.last_updated;
    const sponsor = this.state.sponsor;
    return (
      <ScrollView
        style={styles.backgroundView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <NameHeader
          bill={this.state.bill}
          wasTapped={this.state.personWasTapped}
        />
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>
            {details}
          </Text>
          <BillProgress style={styles.progressView} />

          {this.renderHumanSummary()}
          <Text style={styles.summaryHeader}>
            {'Auto-Generated Summary'}
          </Text>
          {this.renderMachineSummary()}
          <CustomButton
            onPress={() => {}}
            text="Read Full Text"
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.reactionView}>
          <Emoji image={images.smileyEmoji} />
          <Emoji image={images.grinEmoji} />
          <Emoji image={images.uhohEmoji} />
          <Emoji image={images.sadEmoji} />
          <Emoji image={images.angryEmoji} />
        </View>
      </ScrollView>
    );
  }
}


BillDetail.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
};

let styles = StyleSheet.create({
  backgroundView: {
    backgroundColor: '#CFD8DC',
    flex: 1,
    // backgroundColor: 'magenta',
  },
  scrollViewContent: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    // backgroundColor: 'blue',
  },
  header: {
    marginTop: 7,
  },
  subject: {
    backgroundColor: 'white',
    // backgroundColor: 'purple',
    height: 15,
    fontSize: 13,
    fontFamily: 'OpenSans-Light',
    marginLeft: 15,
    marginTop: 14,
  },
  subjectWrapper: {
    backgroundColor: 'white',
    // backgroundColor: 'red',
    marginTop: 7,
  },
  title: {
    flex: -1,
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 25,
    backgroundColor: 'white',
    width: Dimensions.get('window').width - 30,
    // backgroundColor: 'yellow',
    fontFamily: 'OpenSans-Regular',
    color: '#1F222A',
  },
  progressView: {
    marginBottom: 100,
  },
  date: {
    marginTop: 5,
    marginLeft: 15,
    fontSize: 14,
    color: 'grey',
    // backgroundColor: 'green',
  },
  nameView: {
    flexDirection: 'column',
    // backgroundColor: 'yellow',
  },
  sponsor: {
    marginTop: 15,
    marginLeft: 15,
    fontSize: 18,
    fontFamily: 'avenir-medium',
    // backgroundColor: 'green',
  },
  profilePic: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginTop: 15,
    marginLeft: 15,
    // backgroundColor: 'blue',
    borderWidth: 0.5,
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    // backgroundColor: 'cyan',
  },
  summaryHeader: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 17,
    textAlign: 'center',
    color: 'gray',
    marginTop: 7,
  },
  summary: {
    flex: -1,
    margin: 15,
    marginTop: 21,
    marginBottom: 15,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    lineHeight: 25,
    backgroundColor: 'white',
    // backgroundColor: 'orange',
    textAlign: 'left',
  },
  reactionView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 15,
  },
  divider: {
    height: 0.75,
    backgroundColor: '#CFD8DC',
    marginLeft: 15,
    marginRight: 15,
  },
  reactionLabel: {
    flex: 1,
  },

});
