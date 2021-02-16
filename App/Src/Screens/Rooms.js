import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Dimensions, ScrollView} from 'react-native';
import {
  RTCPeerConnection,
  mediaDevices,
  RTCView,
  RTCSessionDescription,
  RTCIceCandidate,
} from 'react-native-webrtc';
import {useDispatch, useSelector} from 'react-redux';
import {withSocket} from '../Utils/withSocket';
const {height, width} = Dimensions.get('window');

const Room = (props) => {
  const [stream, setStream] = useState('');
  const [partnerStream, setPartnerStream] = useState('');
  console.log(partnerStream, 'PARTNER');
  const [userStream, setUserStream] = useState('');
  const peerRef = React.useRef();
  const otherUser = React.useRef();
  const {socket, route} = props;
  const dispatch = useDispatch();
  const {Stream, streams} = useSelector((state) => state.Video);
  useEffect(() => {
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
          socket.emit('join room', route?.params?.id);
          socket.on('other user', (userID) => {
            callUser(userID);
            otherUser.current = userID;
          });
          socket.on('user joined', (userID) => {
            otherUser.current = userID;
          });
          socket.on('offer', handleRecieveCall);
          socket.on('answer', handleAnswer);
          socket.on('ice-candidate', handleNewICECanditateMsg);
          setStream(stream);
          setUserStream(stream);
          //   dispatch(joinRoom(stream));
          // Got stream!
        })
        .catch((error) => {
          console.log(error, 'E');
          // Log error
        });
    });
  }, []);
  const callUser = (id) => {
    peerRef.current = createPeer(id);
    userStream
      .getTracks()
      .forEach((track) => peerRef.current.addStream(track, userStream));
    console.log(id, 'ID');
  };
  const createPeer = (userID) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {urls: 'stun:stun.stunprotocol.org'},
        {
          urls: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com',
        },
      ],
    });
    peer.onicecandidate = handleICECanditateEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);
    peer.onaddstream = (e) => handleTrackEvent(e);
  };
  const handleNegotiationNeededEvent = (userID) => {
    peerRef.current
      .createOffer()
      .then((offer) => {
        return peerRef.current.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          target: userID,
          caller: socket.id,
          sdp: peerRef.current.localDescription,
        };
        socket.emit('offer', payload);
      })
      .catch((e) => {
        console.log(e, 'E');
      });
  };
  const handleRecieveCall = (incoming) => {
    console.log(incoming, 'INCON');
    peerRef.current = createPeer();
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current
      .setRemoteDescription(desc)
      .then(() => {
        userStream
          .getTracks()
          .forEach((track) => peerRef.current.addStream(track, userStream));
      })
      .then(() => {
        return peerRef.current.createAnswer();
      })
      .then((answer) => {
        return peerRef.current.setLocalDescription(answer);
      })
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socket.id,
          sdp: peerRef.current.localDescription,
        };
        socket.emit('answer', payload);
      }).catch(e => console.log(e , "EEE"))
  };
  const handleAnswer = (message) => {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch((e) => console.log(e));
  };
  const handleICECanditateEvent = (e) => {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      };
      socket.emit('ice-candidate', payload);
    }
  };
  const handleNewICECanditateMsg = (incoming) => {
    const candidate = new RTCIceCandidate(incoming);
    peerRef.current
      .addIceCandidate(candidate)
      .catch((e) => console.log(e, 'S'));
  };
  const handleTrackEvent = (e) => {
    console.log(e, 'E');
    setPartnerStream(e.streams[0]);
  };
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
          {userStream && userStream ? (
            <RTCView
              style={{width, height: height * 0.4}}
              streamURL={userStream.toURL()}
            />
          ) : null}
        </View>
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <ScrollView horizontal style={{padding: 10}}>
            <>
              <>
                {/* {partnerStream && (
                  <View
                    style={{
                      width: 280,
                      backgroundColor: 'red',
                      borderWidth: 1,
                      borderColor: '#fff',
                      marginRight: 10,
                      padding: 5,
                    }}>
                    <RTCView
                      streamURL={partnerStream.toURL()}
                      style={{width: 180, height: height * 0.4}}
                    />
                  </View>
                )} */}
                {/* {partnerStream && (
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
                      streamURL={partnerStream.toURL()}
                      style={{width: 180, height: height * 0.4}}
                    />
                  </View>
                )} */}
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

export default withSocket(Room);
