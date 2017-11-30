import firebase from 'react-native-firebase';
import apiKeys from '../assets/apiKeys.json';

const CongressAPI = {
  // Returns curated list of bills based on user's interests
  async getRecentBills(state) {
    await firebase.auth().onAuthStateChanged((user) => {});
    /*
    const user = firebase.auth().currentUser;
    if (user == null) {
      throw 'accessing bills while currentUser for Firebase is null';
    }
    const ref = firebase.database().ref(`users/${user.uid}/subtopics`);
    // Reads value 'once', without listening for future changes to database
    return ref.once('value').then(async (snapshot) => {
      const subtopics = snapshot.val().map(subtopic => subtopic.replace(/ /g, '_'));
      console.log('subtopics:', subtopics);
      const base_url = 'http://www.wethepeople.tech/api/v1/get_newsfeed_bills?';
      const state_str = `state=${state}`;
      const query = `&topic=${subtopics.join('&topic=')}`;
      const url = base_url + state_str + query;
      */
    const url = 'http://www.wethepeople.tech/api/v1/get_newsfeed_bills?topic=Health';
    const response = await fetch(url);
    const bills = await response.json();
    return bills;
    // });
  },
  /*
    Accepts a bioguide_id and returns a legislator object from the API
  */
  getLegislator(bioguide_id) {
    /* Potential performance improvement by fetching all legislator info at once,
    then storing in AsyncStorage:
    */
    /*
    const members = KeyValueStore.get('congress_members');
    if (members == null) {
      fetch(url, this.header)
      .then((response) => response.json())
      .then((responseJson) => {
        const result = responseJson['results']['members'];
        KeyValueStore.set('congress_members', result);
      }
    }
    */
    const url = `https://api.propublica.org/congress/v1/members/${
      bioguide_id}.json`;
    return fetch(url, this.propublicaHeader)
      .then(response => response.json())
      .then(response => response.results[0])
      .catch((error) => {
        console.log(`There was a problem fetching legislator: ${url}`);
        console.log(error);
      });
  },

  propublicaHeader: {
    headers: {
      'X-API-Key': apiKeys.propublica,
    },
  },
};

module.exports = CongressAPI;
