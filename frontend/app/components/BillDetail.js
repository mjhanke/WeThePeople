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
} from 'react-native';
import moment from 'moment';
import CongressAPI from './CongressAPI';
import We from '../images/We.png';
import images from '../assets/images'
import BillProgress from './BillProgress'

export default class BillDetail extends Component {
  static navigationOptions = {
    headerStyle: {backgroundColor: 'white'}
  };

  componentWillMount() {
    const { params } = this.props.navigation.state;
    this.state = {
      summary: 'loading...',
      billExcerpts: '',
      sponsor: '',
      bill: params.bill,
      imageUrl: ' '
    }
    const url = this.state.bill.sponsor.bioguide_id;
    CongressAPI.getLegislator(url)
      .then((response) => {
        this.state.sponsor = response.first_name + ' ' + response.last_name + ' (' + response.current_party + ')';
        this.state.imageUrl = 'https://graph.facebook.com/' + response.facebook_account
          + '/picture?type=large';
        this.forceUpdate();
      })
    this.loadShortenedSummary(this.state.bill);
  }

  render() {
    const details = 'A bill to amend title 38, United States Code, to improve the accountability of employees of the Department of Veterans Affairs, and for other purposes.'
    const date = 'latest action date'
    const relativeDate = 'latest action date'
    return (
      <ScrollView
        style = {styles.backgroundView}
        contentContainerStyle = {styles.scrollViewContent}>
        <View style = {styles.subjectWrapper}>
          <Text style = {styles.subject}>
            {'MY TOPIC'}
          </Text>
        </View>
        <View style = {styles.header}>
          <Image
            style = {styles.profilePic}
            source = {{uri: this.state.imageUrl}}
          />
          <View style = {styles.nameView}>
            <Text style = {styles.sponsor}>
              <Text>
                {this.state.sponsor}
              </Text>
            </Text>
            <Text style = {styles.date}>
              {relativeDate}
            </Text>
          </View>
        </View>
        <View style = {styles.contentWrapper}>
          <Text style = {styles.title}>
            {details}
          </Text>

          <BillProgress style = {styles.progressView}/>
        </View>
        <View style = {styles.summaryView}>
          <Text style = {styles.summary}>
            {this.state.summary}
          </Text>
        </View>
        {this._renderBillExcerpts()}
      </ScrollView>
      );
    }

    _renderBillExcerpts() {
      if (this.state.billExcerpts === '') {
        return null;
      }
      return (
        <View style = {styles.excerptsWrapper}>
          <Text style = {styles.excerptsHeader}>
            Excerpts from Full Bill
          </Text>
          <Text style = {styles.billExcerpts}>
            {this.state.billExcerpts}
          </Text>
        </View>
      );
    }

    loadShortenedSummary(bill) {
      let summary = bill.summary.text;
      if (summary.length === 0) {
        this.state.summary = '';
        return;
      }
      if (summary.includes('This bill ')) {
        summary = summary.split('This bill ')[1];
      }
      this.state.summary = this.capitalizeFirstLetter(summary.split('.')[0] + '.');
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

let styles = StyleSheet.create({
  backgroundView: {
    backgroundColor: '#CFD8DC',
    flex: 1,
    //backgroundColor: 'magenta',
  },
  scrollViewContent: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    //backgroundColor: 'blue',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    //backgroundColor: 'blue',
    marginLeft: 7,
    marginRight: 7,
    backgroundColor: 'white',
  },
  subject: {
    backgroundColor: 'white',
    //backgroundColor: 'purple',
    height: 15,
    fontSize: 13,
    fontFamily: 'OpenSans-Light',
    marginLeft: 15,
    marginTop: 14,
  },
  subjectWrapper: {
    backgroundColor: 'white',
    //backgroundColor: 'red',
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
    //backgroundColor: 'yellow',
    fontFamily: 'OpenSans-Light',
  },
  progressView: {
    flex: 1,
    //backgroundColor: 'cyan',
  },
  date: {
    marginTop: 5,
    marginLeft: 15,
    fontSize: 14,
    color: 'grey',
    //backgroundColor: 'green',
  },
  nameView: {
    flexDirection: 'column',
    //backgroundColor: 'yellow',
  },
  sponsor: {
    marginTop: 15,
    marginLeft: 15,
    fontSize: 18,
    fontFamily: 'avenir-medium',
    //backgroundColor: 'green',
  },
  profilePic: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginTop: 15,
    marginLeft: 15,
    //backgroundColor: 'blue',
    borderWidth: 0.5,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: 'white',
    //backgroundColor: 'cyan',
    marginLeft: 7,
    marginRight: 7,
  },
  summary: {
    flex: -1,
    //backgroundColor: 'orange',
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
    //backgroundColor: 'red',
    flex: 1,
    fontFamily: 'OpenSans-Light',
    margin: 15,
    marginTop: 21,
    marginBottom: 0,
    fontSize: 17
  },
  billExcerpts: {
    flex: -1,
    //backgroundColor: 'orange',
    margin: 15,
    marginTop: 0,
    fontFamily: 'OpenSans-Light',
    fontSize: 15,
  }

});
