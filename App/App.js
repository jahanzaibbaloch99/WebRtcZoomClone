import React, {useEffect} from 'react';
import {SafeAreaView, View, Text, StatusBar} from 'react-native';
import {RTCPeerConnection, mediaDevices} from 'react-native-webrtc';
import {joinRoom} from './Src/Store/Actions/videoActions';
import {useDispatch, useSelector} from 'react-redux';
const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
    const pc = new RTCPeerConnection(configuration);

    let isFront = true;
    mediaDevices.enumerateDevices().then((sourceInfos) => {
      console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: 640,
            height: 480,
            frameRate: 30,
            facingMode: isFront ? 'user' : 'environment',
            deviceId: videoSourceId,
          },
        })
        .then((stream) => {
          // Got stream!
          dispatch(joinRoom(stream));
          console.log(stream, 'STREAM');
        })
        .catch((error) => {
          // Log error
        });
    });

    // pc.createOffer().then((desc) => {
    //   pc.setLocalDescription(desc).then(() => {
    //     // Send pc.localDescription to peer
    //   });
    // });

    // pc.onicecandidate = function (event) {
    //   // send event.candidate to peer
    // };
  });
  return (
    <>
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />
        <View
          style={{flex: 1, justifyContent: 'flex-start', padding: 10}}></View>
      </SafeAreaView>
    </>
  );
};

export default App;
