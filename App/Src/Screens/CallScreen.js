import React, {useState, useEffect} from 'react';
import {View, SafeAreaView, Button, StyleSheet, Text} from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
import {withSocket} from '../Utils/withSocket';
import Peer from 'react-native-peerjs';
// import Peer from 'peerjs';
const WEBRtc = (props) => {
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  // const [caller, setCaller] = useState('');
  // const [callingFriend, setCallingFriend] = useState('');
  const [callAccepted, setCallAccepted] = useState(false);
  // const [receivingCall, setReceiving] = useState(false);
  // let isCaller, peerConnection;
  // const socket = io('https://desolate-earth-25164.herokuapp.com/');
  const {
    receivingCall,
    dialCall,
    caller,
    callingFriend,
    handleCancle,
    setCaller,
    setReceivingCall,
    setDialCall,
    setCallerSignal,
    setCallingFriend,
    setShow,
    localPeer,
    peerId,
    setPeerId,
    socket,
    setRemoteId,
    remotePeer,
    remoteId,
  } = props;
  let mypeerRef = null;
  useEffect(() => {
    // const data = mypeerRef.on('open', (id) => id);
    // console.log(data.id, 'HAHA');
    // socket.emit('peerId', socket.id);
    // socket.on('peerId', (id) => {
    //   console.log(mypeerRef, 'OEER ID ');
    //   mypeerRef.call(peerId);
    //   setPeerId(id.id);
    // });
    if (callingFriend) {
      mediaDevices
        .getUserMedia({video: true, audio: true})
        .then((stream) => {
          setLocalStream(stream);
          setCaller('121212');
          console.log('WPRKING');
          const call = remotePeer.call(remoteId, stream);
          call.on('stream', (rem) => {
            console.log(rem, 'REMOTE');
          });
          console.log(remotePeer, 'LOCAL');
          // peer.on('connect', (con) => console.log('CONN'));
          // mypeerRef = peer;
          // localPeer
          // console.log(peer, 'PEER');
          // peer.on('signalingStateChange', (data) => {
          //   console.log(data, 'DATA');
          // });
          // peer.call(socket.id);
          if (localPeer.WEBRTC_SUPPORT) {
            console.log('SUPPORTED');
          } else {
            console.log('UNSUPPORTED');
          }
          // socket.on('peerId', (id) => {
          //   peer.call(id);
          // });
          // peer.on('signal', (data) => {
          //   console.log(data, 'DAATAA SIGNAL');
          //   socket.emit('callUser', {
          //     userToCall: '121212',
          //     signalData: data,
          //     from: '212121',
          //   });
          // });
          // peer.on('stream', (stream) => {
          //   setRemoteStream(stream);
          // });
          // peer.on('error', (error) => console.log(error));
          // socket.on(`callAccepted-212121`, (signal) => {
          //   setReceiving(false);
          //   setCallAccepted(true);
          //   // peer.signal(signal);
          // });
          // socket.on(`close-212121`, () => {
          //   stream.getTracks().forEach((track) => {
          //     track.stop();
          //   });
          //   localStream
          //     .getTracks()
          //     .forEach()
          //     .forEach((track) => {
          //       track.stop();
          //     });
          //   mypeerRef.destroy();
          //   peer.destroy();
          //   closeCall(false);
          //   setCallingFriend(false);
          //   setCallAccepted(false);
          // });
        })
        .catch((e) => {
          console.log(e, 'EEE');
        });
    }
  }, [callingFriend]);

  const acceptCall = () => {
    remotePeer.on('call', (call) => {
      console.log(call, 'CALL ');

      mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
        console.log(stream, 'STREAM');
        setLocalStream(stream);
        setReceivingCall(false);
        setCallAccepted(true);
        call.answer(stream);
        call.on('stream', (remote) => {
          console.log(remote, 'STREAM');
        });
        // peer.signal(callerSignal);
        socket.on('close-212121', () => {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
          localStream.getTracks().forEach((track) => {
            track.stop();
          });
          remoteStream.getTracks().forEach((track) => {
            track.stop();
          });
          peer.destroy();
          mypeerRef.destroy();
          closeCall(false);
          setCallingFriend(false);
          setCallAccepted(false);
        });
      });
    });
  };
  /**
   * Getting ready for local stream
   */
  // const startLocalStream = () => {
  //   socket.emit('joinTheRoom', '123456');
  // };

  // socket.on('roomCreated', (room) => {
  //   console.log('room created');

  //   mediaDevices.getUserMedia(constraints).then((stream) => {
  //     setLocalStream(stream);
  //     isCaller = true;
  //   });
  // });

  // socket.on('roomJoined', (room) => {
  //   console.log('room joined');
  //   mediaDevices.getUserMedia(constraints).then((stream) => {
  //     setLocalStream(stream);
  //     socket.emit('ready', '123456');
  //   });
  // });

  // useEffect(() => {
  //   const configuration = {
  //     iceServers: [
  //       {urls: 'stun:stun.services.mozilla.com'},
  //       {urls: 'stun:stun.l.google.com:19302'},
  //     ],
  //   };

  //   socket.on('ready', (room) => {
  //     console.log('ready', 'SDADA');
  //     if (isCaller) {
  //       console.log('ready', room);
  //       peerConnection = new RTCPeerConnection(configuration);
  //       peerConnection.onicecandidate = onIceCandidate;
  //       peerConnection.iceConnectionState = (e) => {
  //         console.log('iceConnectionState', e);
  //       };
  //       peerConnection.onaddstream = onAddStream;
  //       peerConnection.createOffer().then((offer) => {
  //         return peerConnection.setLocalDescription(offer).then(() => {
  //           console.log('emit offer');
  //           socket.emit('offer', {
  //             type: 'offer',
  //             sdp: offer,
  //             room: '123456',
  //           });
  //         });
  //       });
  //     }
  //   });

  //   socket.on('offer', (e) => {
  //     if (!isCaller) {
  //       peerConnection = new RTCPeerConnection(configuration);
  //       console.log('offer');

  //       peerConnection.onicecandidate = onIceCandidate;
  //       peerConnection.onaddstream = onAddStream;
  //       peerConnection.iceConnectionState = (e) => {
  //         console.log('iceConnectionState', e);
  //       };
  //       console.log('about to create answer');

  //       //accept offer from here(ready)
  //       peerConnection.setRemoteDescription(e).then(() => {
  //         return peerConnection.createAnswer().then((answer) => {
  //           return peerConnection.setLocalDescription(answer).then(() => {
  //             console.log('emit answer', answer);
  //             socket.emit('answer', {
  //               type: 'answer',
  //               sdp: answer,
  //               room: '123456',
  //             });
  //           });
  //         });
  //       });
  //     }
  //   });

  //   function onAddStream(e) {
  //     console.log('remote stream', e);
  //     if (e.stream && remoteStream !== e.stream) {
  //       console.log('remote stream', e.stream);

  //       setRemoteStream(e.stream);
  //     }
  //   }

  //   function onIceCandidate(event) {
  //     console.log('ice candidate');

  //     if (event.candidate) {
  //       console.log('sending ice candidate', event.candidate);

  //       socket.emit('candidate', {
  //         type: 'candidate',
  //         label: event.candidate.sdpMLineIndex,
  //         id: event.candidate.sdpMid,
  //         candidate: event.candidate.candidate,
  //         room: '123456',
  //       });
  //     }
  //   }

  //   socket.on('candidate', (e) => {
  //     console.log('candidate', isCaller);
  //     peerConnection.addIceCandidate(e);
  //     peerConnection.addStream(localStream);
  //   });

  //   socket.on('answer', (e) => {
  //     console.log('answer', e);
  //     peerConnection.setRemoteDescription(e);
  //   });
  // });
  const startCall = () => {
    setShow(true);
    setDialCall(true);
    setCaller('121212');
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.streamContainer}>
        <View style={styles.streamWrapper}>
          <View style={styles.localStream}>
            {localStream && (
              <RTCView style={styles.rtc} streamURL={localStream.toURL()} />
            )}
            {!localStream && <Button title="Tap to start" />}
          </View>
          <View style={styles.rtcview}>
            {remoteStream && (
              <RTCView style={styles.rtc} streamURL={remoteStream.toURL()} />
            )}
          </View>
        </View>
        {!!remoteStream ? (
          <Button
            style={styles.toggleButtons}
            title="Click to stop call"
            disabled={!remoteStream}
          />
        ) : (
          localStream && (
            <Button title="Click to start call" onPress={startCall} />
          )
        )}
        <Button title="Click to start call" onPress={startCall} />
      </View>
      <View style={styles.streamContainer}>
        <Button title="Click to Accept" onPress={acceptCall} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#313131',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  streamContainer: {
    backgroundColor: 'grey',
    // justifyContent: 'space-around',
    alignItems: 'center',
    height: '50%',
    width: '100%',
    flexDirection: 'column',
  },
  streamWrapper: {
    backgroundColor: 'grey',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    flexDirection: 'row',
  },
  roomTitle: {
    fontSize: 20,
    paddingTop: 20,
  },
  rtcview: {
    width: '45%',
    height: '60%',
    borderColor: '#ccc',
    borderWidth: 3,
  },
  rtc: {
    width: '100%',
    height: '100%',
  },
  localStream: {
    width: '45%',
    height: '60%',
    borderColor: '#ccc',
    borderWidth: 3,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

// socket.on("ready",()=>{

//   if(isCaller){
//     console.log('ready');
//     localPC.onicecandidate = onIceCandidateLocal;
//     localPC.addStream(localST);
//     // localPC.onaddstream = onAddStream;

//     localPC.createOffer()
//      .then(offer=>{
//         localPC.setLocalDescription(offer)
//         .then(()=>{
//           remotePC.setRemoteDescription(localPC.localDescription);

//           console.log('ofer start');
//           socket.emit('offer',{
//             type:'offer',
//             sdp:offer.sdp,
//             room: roomNumber
//           });
//         });
//      }).catch(error=>{
//       console.log(error);
//   });
//   }
// });

// socket.on("offer",e=>{

//     if(!isCaller){
//       console.log('offer');
//         remotePC.onicecandidate = onIceCandidateRemote;
//         remotePC.onaddstream = onAddStream;

//         // remotePC.setRemoteDescription(localPC.localDescription);
//         remotePC.createAnswer().then(answer=>{
//             console.log('answer start');
//               remotePC.setLocalDescription(answer)
//               .then(()=>{
//                   localPC.setRemoteDescription(remotePC.localDescription);
//                   socket.emit('answer',{
//                     type:'answer',
//                     sdp: answer.sdp,
//                     room: roomNumber
//                 });
//               });
//         }).catch(error=>{
//           console.log("answer error", error);
//       });
//       // console.log(`Answer from remotePC: ${answer.sdp}`);
//     }

// });

// function onIceCandidateLocal(e){
//   if (e.candidate) {
//         socket.emit('candidateLocal',{
//             type: 'candidateLocal',
//             label: e.candidate.sdpMLineIndex,
//             id: e.candidate.sdpMid,
//             candidate: e.candidate.candidate,
//             room: roomNumber
//         });
//     }
// }

// function onIceCandidateRemote(e){
//   if (e.candidate) {
//         socket.emit('candidateRemote',{
//             type: 'candidateRemote',
//             label: e.candidate.sdpMLineIndex,
//             id: e.candidate.sdpMid,
//             candidate: e.candidate.candidate,
//             room: roomNumber
//         });
//     }
// }

// socket.on('candidateLocal', e=>{
//   console.log('candidateLocal', e.candidate);
//   remotePC.addIceCandidate(e.candidate);
// });

// socket.on('candidateRemote', e=>{
//   console.log('candidateRemote');
//   localPC.addIceCandidate(e.candidate);
// });

// function onAddStream(e){
//   console.log('add remote stream', e.steram);

//   if (e.stream && remoteStream !== e.stream) {
//     setRemoteStream(e.stream);
//   }
// };

// socket.on('answer', e=>{
//   console.log('answer');
//   localPC.setRemoteDescription(remotePC.localDescription);
// });
export default withSocket(WEBRtc);
