import React, { Component } from 'react';
import {
  Image,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

export default class Emoji extends Component {
    state = {
      isSelected: false,
    }
    render() {
      return (
        <TouchableHighlight
          style={styles.highlight}
          underlayColor="white"
          onPress={() => this.setState({ isSelected: !this.state.isSelected })}
        >
          <Image
            source={this.props.image}
            style={this.state.isSelected ? styles.selectedEmoji : styles.unselectedEmoji}
          />
        </TouchableHighlight>
      );
    }
}

let styles = StyleSheet.create({
  unselectedEmoji: {
    resizeMode: 'contain',
    borderRadius: 25,
    width: 50,
    height: 50,
    marginLeft: 15,
    marginRight: 15,
  },
  selectedEmoji: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#489AF0',
    borderRadius: 5,
  },
  highlight: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    width: 50,
    height: 50,
    margin: 7,
  },
});
