import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, View, TouchableOpacity, Text} from 'react-native';
import {
  RTCPeerConnection,
  mediaDevices,
  RTCView,
  RTCSessionDescription,
  RTCIceCandidate,
} from 'react-native-webrtc';
import {withSocket} from '../Utils/withSocket';
// import {v1 as uuid} from 'uuid';
const Home = (props) => {
  const {socket} = props;
  const onCreate = () => {
    props.navigation.navigate('Rooms', {
      id: '121yef8sy18q7fsga804g',
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('CallScreen');
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            height: 50,
            width: '60%',
            backgroundColor: 'red',
            marginVertical: 10,
          }}>
          <Text>Join Room</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCreate}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            height: 50,
            width: '60%',
            backgroundColor: 'red',
          }}>
          <Text>Create Room</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default withSocket(Home);
