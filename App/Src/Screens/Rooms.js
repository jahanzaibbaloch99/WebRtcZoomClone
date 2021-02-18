import {useFocusEffect} from '@react-navigation/native';
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
  const [userVideo, setUserVideo] = useState(null);
  const [partnerVideo, setPartnerVideo] = useState({});
  const [otherUser, setOtherUser] = useState('');
  const [joinedUser, setJoinedUser] = useState('');
  console.log(otherUser, 'doajda', joinedUser, ' OTHER JOINED');
  React.useEffect(() => {
    if (joinedUser && otherUser) {
      callUser(otherUser, joinedUser);
    }
  }, [joinedUser, otherUser]);
  // const [peerRefer, setPeerRefer] = useState('');
  // const [userStream, setUserStream] = useState('');
  let peerRefer = React.useRef(null);
  // let otherUser = React.useRef();
  // let partnerVideo = React.useRef();
  // let userVideo = React.useRef();
  let userStream = React.useRef();
  console.log(joinedUser, 'JOINER');
  console.log(otherUser, 'OTHER');
  const {socket, route} = props;

  const dispatch = useDispatch();
  const {Stream, streams} = useSelector((state) => state.Video);
  const [referer, setreferer] = useState('');
  console.log(referer);
  useEffect(() => {
    if (referer) {
      console.log(referer, 'useEffect Referer');
      peerRefer.current = referer;
    }
  }, [referer]);
  useEffect(() => {
    if (userVideo) {
      console.log(userVideo, 'useEffect userVideo');
      userStream.current = userVideo;
    }
  }, [userVideo]);
  function handleRecieveCall(incoming) {
    console.log(incoming, 'INCOME HANDLE RECIEVER');
    const peer = createPeer();
    setreferer(peer);
    // peerRefer.current = peer;
    const desc = new RTCSessionDescription(incoming.sdp);
    peer
      .setRemoteDescription(desc)
      .then(() => {
        userStream.current
          .getTracks()
          .forEach((track) => peer.addStream(track, userStream));
      })
      .then(() => {
        console.log('THEN IN CREATE ANSWER');
        return peer.createAnswer();
      })
      .then((answer) => {
        console.log(answer, 'ans');
        return peer.setLocalDescription(answer);
      })
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socket.id,
          sdp: peer.localDescription,
        };
        socket.emit('answer', payload);
      })
      .catch((e) => console.log(e, 'EEE'));
  }
  function handleAnswer(message) {
    console.log(message, 'MESSAGE ANSWER');
    const desc = new RTCSessionDescription(message.sdp);
    console.log(desc, 'DEscription');
    peerRefer.current.setRemoteDescription(desc).catch((e) => console.log(e));
  }
  function handleICECanditateEvent(candidate) {
    if (candidate) {
      const payload = {
        target: otherUser,
        candidate: candidate,
      };
      socket.emit('ice-candidate', payload);
    }
  }
  const handleNewICECanditateMsg = (incoming) => {
    console.log(incoming, 'ICO');
    const candidate = new RTCIceCandidate(incoming);
    peerRefer.current
      .addIceCandidate(candidate)
      .catch((e) => console.log(e, 'S'));
  };
  const handleTrackEvent = (e) => {
    console.log(e, 'E');
    setPartnerVideo(e.streams[0]);
  };
  React.useEffect(() => {
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
          userStream.current = stream;
          // userVideo.current = stream;
          setUserVideo(stream);
          socket.emit('join room', route?.params?.id);
          socket.on('other user', (userID) => callUser(userID));
          socket.on('user joined', (userID) => setJoinedUser(userID));
          // socket.on('user joined', (userID) => setJoinedUser(userID);
          // socket.emit('offer', (data) => handleRecieveCall(data));
          socket.on('offer', handleRecieveCall);
          socket.on('answer', handleAnswer);
          socket.on('ice-candidate', handleNewICECanditateMsg);
          // console.log(stream, "STREAM")
          // setStream(stream);
          // setUserStream(stream);
          //   dispatch(joinRoom(stream));
          // Got stream!
        })
        .catch((error) => {
          console.log(error, 'E');
          // Log error
        });
    });
    // return () => {
    //   socket.off('join room');
    //   socket.off('other user');
    //   socket.off('user joined');
    //   socket.off('offer');
    //   socket.off('answer');
    //   socket.off('ice-candidate');
    // };
  }, []);
  const callUser = (target) => {
    console.log(target, 'Other USERS');

    const peer = createPeer(target);
    setreferer(peer);
    handleNegotiationNeededEvent(target, peer);
    peerRefer.current = peer;
    userStream.current
      .getTracks()
      .forEach((track) => peer.addStream(track, userStream));
  };
  const createPeer = (userID) => {
    const peer = new RTCPeerConnection({
      iceServers: [{url: 'stun:stun.l.google.com:19302'}],
    });
    peer.onicecandidate = handleICECanditateEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID, peer);
    peer.onaddstream = (e) => handleTrackEvent(e);
    return peer;
  };
  const handleNegotiationNeededEvent = (userID, peer) => {
    peer
      .createOffer()
      .then((offer) => {
        console.log(offer, 'off');
        return peer.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          target: userID,
          caller: socket.id,
          sdp: peer.localDescription,
        };
        socket.emit('offer', payload);
      })
      .catch((e) => {
        console.log(e, 'pmlsda');
      });
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
          {userVideo && userVideo ? (
            <RTCView
              style={{width, height: height * 0.4}}
              streamURL={userVideo?.toURL()}
            />
          ) : (
            <></>
          )}
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
