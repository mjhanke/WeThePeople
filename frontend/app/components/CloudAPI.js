/*
This module
*/
const CloudAPI = {
  getFilteredBills(subtopics) {
    let url = 'http://104.196.144.21/bills?';
    subtopics = subtopics.map((element) => element.replace(/ /g, '%20'));
    subtopics.forEach((subtopic) => {
      url = url + 'subtopic=' + subtopic + '&';
    })
    console.log('Requesting CloudAPI url: ' + url);
    return fetch(url)
    .then((response) => response.json())
    .then((response) => {
      console.log('CLOUD API RESPONSE RECEIVED');
      console.log(JSON.stringify(response));
      return response;
    })
    .catch((error) => {
      console.log("There was a problem fetching bills from: " + url);
      console.log(error)
    })
  }
}

module.exports = CloudAPI;
