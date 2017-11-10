const CivicAPI = {
  getRepresentatives(address) {
    const baseUrl = 'https://www.googleapis.com/civicinfo/v2/';
    const apiKey = '?key=AIzaSyCaelyPik0uSyDxNy86JwVaJhwS2YDjXVg';
    const requestType = 'representatives';
    address = address.replace(/ /g, '%20');
    const url = `${baseUrl + requestType + apiKey}&address=${address}`;
    console.log(`Requesting CivicAPI url: ${url}`);
    return fetch(url)
      .then(response => response.json())
      .then((response) => {
        console.log('CIVIC API RESPONSE RECEIVED');
        return response;
      })
      .catch((error) => {
        console.log(`There was a problem fetching list of reps: ${url}`);
        console.log(error);
      });
  },
};

module.exports = CivicAPI;
