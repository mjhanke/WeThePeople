/* Calls the Propublica Congress API */
const CongressAPI = {
  /*
    Returns curated list of bills based on user's interests
  */
  getRecentBills() {
    const url = 'https://api.propublica.org/congress/v1/115/senate/bills/passed.json';
    return fetch(url, this.header)
    .then((response) => response.json())
      .then((responseJson) => {
        console.log("\n\n********PROPUBLICA API RESULT RECEIVED *********\n\n");
        const bills = responseJson.results[0].bills;
        let filteredBills = this.filterResolutions(bills);
        return filteredBills;
      })
      .catch((error) => {
        console.error(error);
      });
  },
  /*
    Accepts a bioguide_id and returns a legislator object from the API
  */
  getLegislator(bioguide_id) {
    /* Potential performance improvement by fetching all legislator info at once,
    then storing in AsyncStorage:
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
    const url = 'https://api.propublica.org/congress/v1/members/'
      + bioguide_id + '.json';
    return fetch(url, this.header)
    .then((response) => response.json())
    .then((response) => {
      return response.results[0];
    })
    .catch((error) => {
      console.log("There was a problem fetching legislator: " + url);
      console.log(error)
    })
  },
  /*
    Removes low-impact bills, e.g., "Recognizing National Youth Sports Week"
  */
  filterResolutions(bills) {
    return bills.filter((bill) => (this.isResolution(bill) == false));
  },

  isResolution(bill) {
    let keywords = ['resolution', 'recognizing', 'designat', 'calling for'];
    let hasKeyword = new RegExp(keywords.join('|'));
    return hasKeyword.test(bill.title);
  },

  header : {headers: {
    'X-API-Key': '76l8Lwp3w45mu6BeOShc17r3H4I264iK2mqMfX1k'
  }},
}

module.exports = CongressAPI;
