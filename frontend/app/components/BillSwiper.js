/* @flow */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Swiper from './Swiper';
import BillSwiperCard from './BillSwiperCard';
import SwiperButton from './SwiperButton';
import bill from '../assets/sampleWeThePeopleBill.json';

export default class BillSwiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: ['1', '2', '3'],
      swipedAllCards: false,
      swipeDirection: '',
      isSwipingBack: false,
      cardIndex: 0,
      labels: {
        left: {
          title: 'NO',
          style: {
            label: styles.noLabel,
            wrapper: styles.noLabelWrapper,
          },
        },
        right: {
          title: 'YES',
          style: {
            label: styles.yesLabel,
            wrapper: styles.yesLabelWrapper,
          },
        },
      },
    };
  }

  onSwipedAllCards = () => {
    this.setState({
      swipedAllCards: true,
    });
  };

  renderCard = card => (
    <BillSwiperCard
      bill={bill}
      personWasTapped={this.props.personWasTapped}
    />
  )

  render() {
    return (
      <View style={styles.container}>
        <Swiper
          ref={(swiper) => {
          this.swiper = swiper;
        }}
          onSwiped={this.onSwiped}
          onTapCard={this.props.billWasTapped}
          cards={this.state.cards}
          cardIndex={this.state.cardIndex}
          cardVerticalMargin={0}
          cardHorizontalMargin={0}
          marginTop={0}
          marginBottom={0}
          verticalSwipe={false}
          renderCard={this.renderCard}
          onSwipedAll={this.onSwipedAllCards}
          overlayLabels={this.state.labels}
          animateOverlayLabelsOpacity
          backgroundColor="#CFCFD1"
        />
        <View style={styles.buttonView}>
          <SwiperButton
            color="red"
            text="NO"
            onPress={() => {}}
          />
          <SwiperButton
            color="green"
            text="YES"
            onPress={() => {}}
          />
        </View>
      </View>
    );
  }
}

BillSwiper.propTypes = {
  billWasTapped: PropTypes.func.isRequired,
  personWasTapped: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 10,
    // backgroundColor: 'yellow',
    // backgroundColor: '#CFCFD1',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    backgroundColor: 'white',
    // backgroundColor: 'magenta',
  },
  card: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: 'white',
    shadowColor: '#494F54',
    shadowOffset: {
      width: 4,
      height: 8,
    },
    shadowRadius: 4,
    shadowOpacity: 0.2,
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent',
  },
  yesLabel: {
    backgroundColor: 'white',
    borderColor: '#4CAF50',
    color: '#4CAF50',
    borderWidth: 2,
    elevation: 3,
  },
  yesLabelWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 30,
    marginLeft: 30,
    elevation: 3,
  },
  noLabel: {
    backgroundColor: 'white',
    borderColor: '#F44336',
    color: '#F44336',
    borderWidth: 2,
    elevation: 3,
    fontFamily: 'OpenSans-Regular',
  },
  noLabelWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: 30,
    marginLeft: -30,
    elevation: 3,
  },
  summary: {

  },
});
