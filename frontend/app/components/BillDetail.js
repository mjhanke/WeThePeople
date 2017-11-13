import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import CongressAPI from './CongressAPI';
import BillProgress from './BillProgress';
import NameHeader from './NameHeader';

export default class BillDetail extends Component {
  static navigationOptions = {
    headerStyle: { backgroundColor: 'white' },
  };

  componentWillMount() {
    const { params } = this.props.navigation.state;
    this.setState({
      billExcerpts: '',
      sponsor: '',
      bill: params.bill,
      imageUrl: ' ',
      legId: '',
      personWasTapped: params.personWasTapped,
      humanSummary: this.getHumanSummaryForBill(params.bill),
      machineSummary: this.getMachineSummaryForBill(params.bill),
    });
    const legislatorId = params.bill.sponsor.id;
    CongressAPI.getLegislator(legislatorId)
      .then((response) => {
        this.setState({
          sponsor: `${response.first_name} ${response.last_name} `,
          imageUrl: `https://graph.facebook.com/${response.facebook_account}/picture?type=large`,
          party: `(${response.current_party}-${response.roles[0].state})`,
          legId: response.member_id,
        });
      });
  }

  getHumanSummaryForBill(bill) {
    if (bill.human_summary.length !== 0) {
      return `${bill.human_summary.split('.')[0]}.`;
    }
    return '';
  }


  getMachineSummaryForBill(bill) {
    if (bill.machine_summary.length !== 0) {
      return bill.machine_summary;
    }
    return '';
  }


  renderBillExcerpts() {
    if (this.state.billExcerpts === '') {
      return null;
    }
    return (
      <View style={styles.excerptsWrapper}>
        <Text style={styles.excerptsHeader}>
            Excerpts from Full Bill
        </Text>
        <Text style={styles.billExcerpts}>
          {this.state.billExcerpts}
        </Text>
      </View>
    );
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
        <View style={styles.subjectWrapper}>
          <Text style={styles.subject}>
            {subject}
          </Text>
        </View>
        <NameHeader
          name={this.state.sponsor}
          imageUrl={this.state.imageUrl}
          party={this.state.party}
          wasTapped={this.state.personWasTapped}
          date={relativeDate}
          legId={this.state.legId}
        />
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>
            {details}
          </Text>

          <BillProgress style={styles.progressView} />
        </View>
        <View style={styles.summaryView}>
          <Text style={styles.summary}>
            {this.state.humanSummary}
          </Text>
        </View>
        <View style={styles.summaryView}>
          <Text style={styles.summary}>
            {this.state.machineSummary}
          </Text>
        </View>
        {this.renderBillExcerpts()}
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    // backgroundColor: 'blue',
    marginLeft: 7,
    marginRight: 7,
    backgroundColor: 'white',
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
    marginLeft: 7,
    marginRight: 7,
    marginTop: 7,
  },
  title: {
    flex: -1,
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    fontSize: 17,
    lineHeight: 25,
    backgroundColor: 'white',
    // backgroundColor: 'yellow',
    fontFamily: 'OpenSans-Light',
  },
  progressView: {
    flex: 1,
    // backgroundColor: 'cyan',
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
    backgroundColor: 'white',
    // backgroundColor: 'cyan',
    marginLeft: 7,
    marginRight: 7,
  },
  summary: {
    flex: -1,
    // backgroundColor: 'orange',
    margin: 15,
    marginTop: 21,
    marginBottom: 28,
    fontFamily: 'OpenSans-Light',
    fontSize: 15,
    lineHeight: 25,
  },
  summaryView: {
    marginTop: 9,
    margin: 7,
    backgroundColor: 'white',
  },
  excerptsWrapper: {
    marginTop: 9,
    margin: 7,
    backgroundColor: 'white',

  },
  excerptsHeader: {
    // backgroundColor: 'red',
    flex: 1,
    fontFamily: 'OpenSans-Light',
    margin: 15,
    marginTop: 21,
    marginBottom: 0,
    fontSize: 17,
  },
  billExcerpts: {
    flex: -1,
    // backgroundColor: 'orange',
    margin: 15,
    marginTop: 0,
    fontFamily: 'OpenSans-Light',
    fontSize: 15,
  },

});
