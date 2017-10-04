import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Button,
  Image,
  Animated,
  TouchableOpacity
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';

import Drawer from 'react-native-drawer'
import ControlPanel from './ControlPanel'

import TabView from './TabView'

export default class MainView extends Component {
  state = {
    drawerOpen: false,
    drawerDisabled: false
  };

  toggleDrawer() {
    if (this.state.drawerOpen) {
      this._drawer.close()
    } else {
      this._drawer.open()
    }
  }

  constructor(props) {
    super(props);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.billWasTapped = this.billWasTapped.bind(this);
  }

  render() {
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="static"
        content={
          <ControlPanel closeDrawer={this.closeDrawer} />
        }
        onOpen={() => {this.setState({drawerOpen: true})}}
        onClose={() => {this.setState({drawerOpen: false})}}
        captureGestures={true}
        tweenDuration={100}
        panThreshold={0.06}
        disabled={this.state.drawerDisabled}
        openDrawerOffset={(viewport) => {
          return 150;
        }}
        style = {styles.drawer}
        closedDrawerOffset={() => 0}
        panOpenMask={0.05}
        negotiatePan
        >
        <TabView
          billWasTapped={(bill) => {this.billWasTapped(bill)}}
          toggleDrawer={() => { this.toggleDrawer() }}/>
          <View>
            <TouchableHighlight style={styles.addButton}
                underlayColor='white' onPress={()=>{console.log('pressed')}}>
                <Image
                  style = {styles.actionButtonImage}
                  source={require('../images/instabug_icon.png')}
                />
            </TouchableHighlight>
          </View>
      </Drawer>
    );
  }
  billWasTapped(bill) {
    const { navigate } = this.props.navigation;
    navigate('BillDetail', { bill: bill });
  }
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
  },
  addButton: {
    height: 70,
    width: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  actionButtonImage: {
    height: 70,
    width: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  }
});

AppRegistry.registerComponent('MainView', () => MainView);
