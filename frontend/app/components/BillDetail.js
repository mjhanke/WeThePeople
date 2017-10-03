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
    this.loadShortenedSummary = this.loadShortenedSummary.bind(this);
    this.saveShortenedSummaryResult = this.saveShortenedSummaryResult.bind(this);
    this.loadBillTextSummary = this.loadBillTextSummary.bind(this);
    this.saveBillExcerpts = this.saveBillExcerpts.bind(this);
    this.state = {
      summary: 'loading...',
      billExcerpts: '',
      sponsor: '',
      bill: params.bill,
      imageUrl: ''
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
    this.loadBillTextSummary(this.state.bill);
  }

  render() {
    topic = getTopic(this.state.bill).toUpperCase();
    const details = getContent(this.state.bill);
    const date = getLatestActionDate(this.state.bill);
    const relativeDate = 'Updated ' + moment(date).fromNow();
    return (
      <ScrollView
        style = {styles.backgroundView}
        contentContainerStyle = {styles.scrollViewContent}>
        <View style = {styles.subjectWrapper}>
          <Text style = {styles.subject}>
            {topic}
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
          <Text style = {styles.summary}>
            {this.state.summary}
          </Text>
          <BillProgress style = {styles.progressView}/>
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
          <View style = {styles.separator} />
        </View>
      );
    }
    loadShortenedSummary(bill) {
      let summary = bill.summary.text;
      if (summary.text.length === 0) {
        this.state.summary.text = '';
        return;
      }
      if (summary.includes('This bill ')) {
        summary = bill.summary.text.split('This bill ')[1];
      }
      this.state.summary.text = capitalizeFirstLetter(summary.split('.')[0] + '.');
      //SummaryTool.summarize('', summary, this.saveShortenedSummaryResult);
    }
    saveShortenedSummaryResult(err, summary) {
      if (err) {
        console.log("Unable to summarize text for bill: " + err);
      }
      //console.log('finished summarizing: ' + summary);
      this.state.summary = capitalizeFirstLetter(summary);
      this.forceUpdate();
    }
    loadBillTextSummary(bill) {
      const url = bill.congressdotgov_url + '/text';
      //const url = 'http://www.cnn.com/2017/06/16/politics/rod-rosenstein-doj-tension/index.html';
      //SummaryTool.summarizeFromUrl('', url, this.saveBillExcerpts);
      fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        //console.log('\n\n\n Raw text: ');
        //console.log(responseText);
        let noTags = responseText.replace(/(<([^>]+)>)/ig,'');

        //console.log('\n\n\n Tags removed: ');
        //console.log(noTags);
        const textEndIndex = noTags.length - 4249;
        const textBeginningIndex = 13700;

        noTags = noTags.substring(textBeginningIndex, textEndIndex);
        // Remove newlines
        noTags = noTags.replace(/(\r\n|\n|\r|&lt;|&gt;|``)/gm, '');
        // Remove everything that's between parentheses
        noTags = noTags.replace(/ *\([^)]*\) */g, ' ');

        if (noTags.includes('text has not been received for')
          || noTags.includes('Delays can occur when there are a large number of bills')
          || noTags.length < 2000) {
          this.state.billExcerpts = '';
          return;
        }
        //SummaryTool.summarize('', noTags, this.saveBillExcerpts);
      })
    }

    saveBillExcerpts(err, summary) {
      if (err) {
        console.log("Unable to summarize text for bill: " + err);
      }
      //console.log('\n\n\n Bill text summary: ' + summary);

      // Remove dashes
      summary = summary.replace(/(—)/g, ' ');
      // Break up sentences for readability
      summary = summary.replace(/(\. )|(; )/g, '.\r\r');

      this.state.billExcerpts = summary;
      this.forceUpdate();
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
    color: 'black',
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
    flex: 1,
    flexShrink: 0.5,
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 17,
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
    color: 'black',
  },
  sponsor: {
    marginTop: 15,
    marginLeft: 15,
    fontSize: 18,
    fontFamily: 'avenir-medium',
    //backgroundColor: 'green',
  },
  topic: {
    marginTop: 5,
    marginBottom: 15,
    marginRight: 15,
    marginLeft: 15,
    fontSize: 16,
    //backgroundColor: 'green',
    backgroundColor: 'white',
    textAlign: 'right',
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
  latestAction: {
    height: 50,
    margin: 15,
    marginTop: 0,
    fontFamily: 'OpenSans-Light',
    fontSize: 16,
    color: '#575b5b',
    //backgroundColor: 'green',
  },
  contentWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    backgroundColor: 'white',
    //backgroundColor: 'cyan',
    marginLeft: 7,
    marginRight: 7,
  },
  separator: {
    height: 1,
    margin: 20,
    backgroundColor: '#EEEEEE',
  },
  summary: {
    flex: -1,
    //backgroundColor: 'orange',
    margin: 15,
    marginTop: 21,
    marginBottom: 28,
    fontFamily: 'OpenSans-Light',
    fontSize: 15,
    color: 'black',
    lineHeight: 25,
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
