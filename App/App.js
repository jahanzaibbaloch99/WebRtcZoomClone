import React, {useEffect} from 'react';
import {SafeAreaView, View, Dimensions, ScrollView} from 'react-native';
import {RTCPeerConnection, mediaDevices, RTCView} from 'react-native-webrtc';
import {joinRoom} from './Src/Store/Actions/videoActions';
import {useDispatch, useSelector} from 'react-redux';
import {MY_STREAM} from './Src/Store/Actions/types';
const {height, width} = Dimensions.get('window');

const App = () => {
  const dispatch = useDispatch();
  const {Stream, streams} = useSelector((state) => state.Video);
  console.log(streams, 'STREAMS');
  useEffect(() => {
    const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
    const pc = new RTCPeerConnection(configuration);
    let isFront = true;
    mediaDevices.enumerateDevices().then((sourceInfos) => {
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
          dispatch(joinRoom(stream));
          // Got stream!
        })
        .catch((error) => {
          console.log(error, 'E');
          // Log error
        });
    });
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, justifyContent: 'flex-start', padding: 10}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            height: height * 0.5,
            borderColor: 'yellow',
            borderWidth: 4,
          }}>
          {Stream && Stream ? (
            <RTCView
              style={{width, height: height * 0.4}}
              streamURL={Stream.toURL()}
            />
          ) : null}
        </View>
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <ScrollView horizontal style={{padding: 10}}>
            <>
              <>
                {streams.length > 0 ? (
                  streams?.map((data, index) => {
                    console.log(data.toURL(), 'STREAM');
                    return (
                      <View
                        key={index}
                        style={{
                          width: 280,
                          backgroundColor: 'red',
                          borderWidth: 1,
                          borderColor: '#fff',
                          marginRight: 10,
                          padding: 5,
                        }}>
                        <RTCView
                          streamURL={data.toURL()}
                          style={{width: 180, height: height * 0.4}}
                        />
                      </View>
                    );
                  })
                ) : (
                  <></>
                )}
              </>
            </>
            <>
              <View
                style={{
                  width: 280,
                  backgroundColor: 'blue',
                  borderWidth: 1,
                  borderColor: '#fff',
                  marginRight: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}></View>
            </>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App;
