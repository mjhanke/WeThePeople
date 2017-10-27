import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  TouchableHighlight,
  StyleSheet,
  AppRegistry,
} from 'react-native';

export default class ProfilePic extends Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.highlight}
        underlayColor="white"
        onPress={() => this.props.wasTapped(this.props.person)}
      >
        <Image
          style={styles.profilePic}
          source={{ uri: this.props.imageUrl }}
        />
      </TouchableHighlight>
    );
  }
}

ProfilePic.propTypes = {
  wasTapped: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  highlight: {
    height: 60,
    width: 60,
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 30,
  },
  profilePic: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'gray',
  },
});

AppRegistry.registerComponent('ProfilePic', () => ProfilePic);
