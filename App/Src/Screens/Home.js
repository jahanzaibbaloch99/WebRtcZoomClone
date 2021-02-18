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
    // const id = uuid();
    props.navigation.navigate('Rooms', {
      id: '121yef8sy18q7fsga804g',
    });
  };
  // const id = '121yef8sy18q7fsga804g';
  // const [callingFriend, setCallingFriend] = useState(false);
  // const [caller, setCaller] = useState('');
  // const [callerSignal, setCallerSignal] = useState();
  // const [receivingCall, setReceivingCall] = useState(false);
  // const [callAccepted, setCallAccepted] = useState(false);
  // const [callRejected, setCallRejected] = useState(false);
  // const [receiverID, setReceiverID] = useState('');
  // const [modalVisible, setModalVisible] = useState(false);
  // const [modalMessage, setModalMessage] = useState('');
  // const [audioMuted, setAudioMuted] = useState(false);
  // const [videoMuted, setVideoMuted] = useState(false);
  // const [isfullscreen, setFullscreen] = useState(false);
  // const [userVideo, setUserVideo] = useState(null);
  // const [partnerVideo, setPartnerVideo] = useState(null);
  // const [stream, setStream] = useState(null);
  // const [strapiRes, setStrapiRes] = useState('');
  // const [strapiFriend, setStrapiFriend] = useState('');
  // const userVideo = useRef();
  // const partnerVideo = useRef();
  // const myPeer = useRef();
  // useEffect(() => {
  //   socket.on('join room', id);
  //   socket.on('other user', (userID) => setStrapiRes(userID));
  //   socket.on('user joined', (userID) => setStrapiFriend(userID));
  //   socket.on('offer', handleRecieveCall);
  //   socket.on('answer', handleAnswer);
  //   socket.on('ice-candidate', handleNewICECanditateMsg);
  // }, []);
  // const handleNewICECanditateMsg = (incoming) => {
  //   console.log(incoming, 'ICO');
  //   const candidate = new RTCIceCandidate(incoming);
  //   peerRefer.current
  //     .addIceCandidate(candidate)
  //     .catch((e) => console.log(e, 'S'));
  // };
  // function handleAnswer(message) {
  //   console.log(message, 'MESSAGE ANSWER');
  //   const desc = new RTCSessionDescription(message.sdp);
  //   console.log(desc, 'DEscription');
  //   peerRefer.current.setRemoteDescription(desc).catch((e) => console.log(e));
  // }
  // function handleRecieveCall(incoming) {
  //   console.log(incoming, 'INCOME HANDLE RECIEVER');
  //   const peer = createPeer(incoming.target);
  //   setreferer(peer);
  //   // peerRefer.current = peer;
  //   const desc = new RTCSessionDescription(incoming.sdp);
  //   peer
  //     .setRemoteDescription(desc)
  //     .then(() => {
  //       userStream.current
  //         .getTracks()
  //         .forEach((track) => peer.addStream(track, userStream));
  //     })
  //     .then(() => {
  //       console.log('THEN IN CREATE ANSWER');
  //       return peer.createAnswer();
  //     })
  //     .then((answer) => {
  //       console.log(answer, 'ans');
  //       return peer.setLocalDescription(answer);
  //     })
  //     .then(() => {
  //       const payload = {
  //         target: incoming.target,
  //         caller: incoming.caller,
  //         sdp: peer.localDescription,
  //       };
  //       console.log(payload, 'PAYLOAD ANSWER');
  //       socket.emit('answer', payload);
  //     })
  //     .catch((e) => console.log(e, 'EEE'));
  // }
  // useEffect(() => {
  //   let isFront = true;
  //   if (callingFriend) {
  //     mediaDevices.enumerateDevices().then((sourceInfos) => {
  //       let videoSourceId;
  //       for (let i = 0; i < sourceInfos.length; i++) {
  //         const sourceInfo = sourceInfos[i];
  //         if (
  //           sourceInfo.kind == 'videoinput' &&
  //           sourceInfo.facing == (isFront ? 'front' : 'environment')
  //         ) {
  //           videoSourceId = sourceInfo.deviceId;
  //         }
  //       }
  //       mediaDevices
  //         .getUserMedia({
  //           audio: true,
  //           video: {
  //             width: 640,
  //             height: 480,
  //             frameRate: 30,
  //             facingMode: isFront ? 'user' : 'environment',
  //             deviceId: videoSourceId,
  //           },
  //         })
  //         .then((stream) => {
  //           setStream(stream);
  //           setCaller('u6jabu8f5732gb5jsd');
  //           setUserVideo(stream);
  //           const peer = new RTCPeerConnection({
  //             iceServers: [
  //               {url: 'stun:stun01.sipphone.com'},
  //               {url: 'stun:stun.ekiga.net'},
  //               {url: 'stun:stun.fwdnet.net'},
  //               {url: 'stun:stun.ideasip.com'},
  //               {url: 'stun:stun.iptel.org'},
  //               {url: 'stun:stun.rixtelecom.se'},
  //               {url: 'stun:stun.schlund.de'},
  //               {url: 'stun:stun.l.google.com:19302'},
  //               {url: 'stun:stun1.l.google.com:19302'},
  //               {url: 'stun:stun2.l.google.com:19302'},
  //               {url: 'stun:stun3.l.google.com:19302'},
  //               {url: 'stun:stun4.l.google.com:19302'},
  //               {url: 'stun:stunserver.org'},
  //               {url: 'stun:stun.softjoys.com'},
  //               {url: 'stun:stun.voiparound.com'},
  //               {url: 'stun:stun.voipbuster.com'},
  //               {url: 'stun:stun.voipstunt.com'},
  //               {url: 'stun:stun.voxgratia.org'},
  //               {url: 'stun:stun.xten.com'},
  //               {
  //                 url: 'turn:numb.viagenie.ca',
  //                 credential: 'muazkh',
  //                 username: 'webrtc@live.com',
  //               },
  //               {
  //                 url: 'turn:192.158.29.39:3478?transport=udp',
  //                 credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
  //                 username: '28224511:1379330808',
  //               },
  //               {
  //                 url: 'turn:192.158.29.39:3478?transport=tcp',
  //                 credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
  //                 username: '28224511:1379330808',
  //               },
  //             ],
  //           });
  //           peer.onicecandidate = () => {
  //             const payload = {
  //               target: strapiFriend,
  //               candidate: strapiRes,
  //             };
  //             socket.emit('ice-candidate', payload);
  //           };
  //           peer.onnegotiationneeded = () => {
  //             console.log(peer, 'PEER');
  //             peer
  //               .createOffer()
  //               .then((offer) => {
  //                 return peer.setLocalDescription(offer);
  //               })
  //               .then(() => {
  //                 const payload = {
  //                   target: id,
  //                   candidate: caller,
  //                   sdp: peer.localDescription,
  //                 };
  //                 socket.emit('offer', payload);
  //               })
  //               .catch((e) => console.log(e));
  //           };
  //           peer.onaddstream = (e) => {
  //             setPartnerVideo(e.streams[0]);
  //           };
  //         })
  //         .catch((error) => {
  //           console.log(error, 'E');
  //           // Log error
  //         });
  //     });
  //   }
  // }, []);
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
