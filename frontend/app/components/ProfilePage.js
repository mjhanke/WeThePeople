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
  ImageBackground,
} from 'react-native';
import CongressAPI from './CongressAPI';
import ProgressiveImage from './ProgressiveImage';

export default class ProfilePage extends Component {
  static navigationOptions = {
    headerStyle: { backgroundColor: 'white' },
  };

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      name: '',
      imageUrl: 'https://media.giphy.com/media/KKlNU6e4dWCGY/source.gif',
      party: '',
      state: '',
      title: '',
      bio: '',
    };
    CongressAPI.getLegislator(params.legId)
      .then((response) => {
        this.setState({
          response: response,
          name: `${response.first_name} ${response.last_name} `,
          imageUrl: `https://graph.facebook.com/${response.facebook_account}/picture?type=large`,
          party: response.current_party,
          state: response.roles[0].state,
          title: response.roles[0].title,
        });
      }).then(() => {
        this.fetchBio();
      })

  }

  fetchBio() {
    first_name = this.state.response.first_name;
    last_name = this.state.response.last_name;
    url = `https://en.wikipedia.org/w/api.php?format=json&action=query` +
           `&prop=extracts&exintro=&explaintext=&titles=` +
           `${first_name}%20${last_name}`;
    return fetch(url)
      .then(response => response.json())
      .then((response) => {
        const pages = response['query']['pages'];
        this.setState({ bio: 'not set'});
        if (!response['query']['pages'].hasOwnProperty('-1')) {
          // found a matching Wikipedia page
          for (const key in pages) {
            if (pages.hasOwnProperty(key)) {
              const { extract } = pages[key];
              this.setState({
                bio: this.shortenBio(extract),
              });
            }
          }
        }
        return response;
      }).catch((error) => {
        this.setState({ bio: 'Bio unavailable'});
        console.log(error)
      });

  }

  shortenBio(bio) {

    if (bio.includes(')')) {
      // Removes birthday
      bio = bio.replace(/ *\([^)]*\) */g, ' ');
    }
    // if (bio.includes('. ')) {
    //   //remove first sentence
    //   bio = bio.substring(bio.indexOf(' is ') + 1);
    //   bio = bio.substring(bio.indexOf('. ') + 2);
    // }

    return bio;
  }

  render() {
    return (
      <ScrollView
        style={styles.backgroundView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.cardView}>
          <View style={styles.nameView}>
            <Image
              style={styles.profilePic}
              source={{ uri: this.state.imageUrl }}
              thumbnail={require('../images/hamsterOnWheel.gif')}
            />
          </View>
          <Text style={styles.name}>
            {this.state.name}
          </Text>
          <Text style={styles.title}>
            {this.state.title}
          </Text>
          <Text style={styles.bio}>
            {this.state.bio}
          </Text>
        </View>
      </ScrollView>
    );
  }

  renderBadge(text, label) {
    return (
      <View style={styles.expView}>
        <Text style={styles.experience}>
          {text}
        </Text>
        <View style={styles.expLabelView}>
          <Text style={styles.expLabel}>
            {label}
          </Text>
        </View>
      </View>
    );
  }

  renderIdeologyScale() {
    return (
      <View style={styles.gradientView}>
        <ImageBackground
          style={styles.gradient}
          source={require('../images/ideology_gradient.png')}
        >
          <View style={styles.ideologyIndicator} />
        </ImageBackground>
        <View style={styles.ideologyLabelView}>
          <Text style={styles.ideologyLabel}>
            Liberal
          </Text>
          <Text style={styles.ideologyLabel}>
            Conservative
          </Text>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  cardView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'white',
    margin: 9,
    marginTop: 100,
  },
  name: {
    flex: 2,
    backgroundColor: 'white',
    fontFamily: 'OpenSans-Semibold',
    textAlign: 'center',
    fontSize: 27,
    marginBottom: 5,
  },
  nameView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    backgroundColor: 'white',
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    fontSize: 20,
    color: 'gray',
  },
  profilePic: {
    flex: 5,
    height: 150,
    width: 150,
    marginTop: -75,
    marginBottom: 15,
    borderRadius: 75,
    borderColor: 'gray',
    backgroundColor: 'gray',
    borderWidth: 2,
  },
  stats: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
  },
  expView: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 32.5,
    borderWidth: 1,
    height: 65,
    width: 65,
    borderColor: 'gray',
  },
  expLabel: {
    color: 'white',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  expLabelView: {
    height: 20,
    width: 60,
    borderRadius: 9,
    marginBottom: -6,
    backgroundColor: 'gray',
  },
  experience: {
    flex: 1,
    borderRadius: 32.5,
    height: 65,
    width: 65,
    color: 'gray',
    textAlign: 'center',
    marginTop: 12,
    backgroundColor: 'transparent',
    fontFamily: 'OpenSans-Semibold',
    fontSize: 25,
  },
  bio: {
    marginLeft: 15,
    marginRight: 15,
    margin: 15,
    fontFamily: 'OpenSans-Regular',
    fontSize: 17,
  },
  gradientView: {
    flex: -1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'white',
    margin: 9,
    marginTop: 0,
  },
  gradient: {
    flex: 1,
    height: 15,
    width: (Dimensions.get('window').width) - 36,
    marginLeft: 9,
    marginRight: 9,
    marginTop: 9,
  },
  ideologyLabelView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    marginTop: 5,
  },
  ideologyLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: 'gray',
  },
  ideologyIndicator: {
    height: 30,
    width: 5,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'magenta',
    marginTop: -7,
    marginLeft: 300,
  },
});
