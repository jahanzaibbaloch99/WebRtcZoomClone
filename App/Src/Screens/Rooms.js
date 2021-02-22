import React, {PureComponent, useEffect} from 'react';
import {View, SafeAreaView, Button, StyleSheet, Dimensions} from 'react-native';

import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCSessionDescription,
  RTCIceCandidate,
  RTCSessionDescriptionType,
  RTCIceCandidateType,
} from 'react-native-webrtc';
import {withSocket} from '../Utils/withSocket';
const {height, width} = Dimensions.get('window');

const Room = (props) => {
  const {socket} = props;
  const [localStream, setLocalStream] = React.useState();
  const [remoteStream, setRemoteStream] = React.useState();
  const [cachedLocalPC, setCachedLocalPC] = React.useState();
  const [cachedRemotePC, setCachedRemotePC] = React.useState();
  const [isMuted, setIsMuted] = React.useState(false);
  const [userID, setUserId] = React.useState('');
  const [offerData, setOfferData] = React.useState('');

  const [partnerID, setParnetId] = React.useState('');
  const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
  const localPC = new RTCPeerConnection(configuration);
  useEffect(() => {
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
          // setCachedLocalPC(stream);
          setLocalStream(stream);

          socket.emit('join room', '93274hfhr23t');

          socket.on('user joined', (data) => {
            setUserId(data);
          });
          socket.on('other user', (userID) => {
            console.log('other user', userID);
            setParnetId(userID);
          });
          // Got stream!
        })
        .catch((error) => {
          // Log error
        });
    });

    socket.on('offer', (data) => {
      console.log('offer ', data);
      setOfferData(data);
      const offer = localPC
        .setRemoteDescription(new RTCSessionDescription(data.sdp))
        .then((ele) => localPC.createAnswer())
        .then((ans) => {
          console.log(ans, 'ANS');
          localPC.setLocalDescription(ans);
        });
      console.log(offer, 'OFFEr');
    });
    socket.on('answer', (data) => {
      console.log('Data , ', data);
      const answer = localPC.setRemoteDescription(
        new RTCSessionDescription(data.sdp),
      );
      console.log(answer);
    });
    socket.on('ice-candidate', (data) => {
      console.log('ICE ', data);
      localPC
        .addIceCandidate(new RTCIceCandidate(data.candidate))
        .then((com) => console.log('ICE'));
    });
  }, []);
  localPC.onicecandidate = (e) => {
    console.log(e, 'EE');
    if (e.candidate) {
      const payload = {
        target: userID,
        candidate: e.candidate,
      };
      console.log(payload, 'CONSSS');
      socket.emit('ice-candidate', payload);
    }
  };
  localPC.onaddstream = (e) => {
    console.log(e, 'E');
    if (e.stream && remoteStream !== e.stream) {
      console.log('RemotePC received the stream', e.stream);
      setRemoteStream(e.stream);
    }
  };

  const createOffer = () => {
    console.log('WORKING');
    localPC.createOffer().then((offer) => {
      console.log(offer, 'OFFEr');
      localPC.setLocalDescription(offer);
      const payload = {
        target: userID,
        caller: socket.id,
        sdp: offer,
      };
      socket.emit('offer', payload);
    });
  };
  const createAnswer = () => {
    localPC.createAnswer((ans) => {
      console.log(ans, 'SAS');
      localPC.setLocalDescription(ans);
      const payload = {
        target: userID,
        caller: socket.id,
        sdp: ans,
      };
      socket.emit('answer', payload);
    });
  };

  const switchCamera = () => {
    localStream.getVideoTracks().forEach((track) => track._switchCamera());
  };

  // Mutes the local's outgoing audio
  const toggleMute = () => {
    if (!remoteStream) return;
    localStream.getAudioTracks().forEach((track) => {
      console.log(track.enabled ? 'muting' : 'unmuting', ' local track', track);
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  const closeStreams = () => {
    if (cachedLocalPC) {
      cachedLocalPC.removeStream(localStream);
      cachedLocalPC.close();
    }
    if (cachedRemotePC) {
      cachedRemotePC.removeStream(remoteStream);
      cachedRemotePC.close();
    }
    setLocalStream();
    setRemoteStream();
    setCachedRemotePC();
    setCachedLocalPC();
  };

  return (
    <SafeAreaView style={styles.container}>
      {!localStream && <Button title="Click to start stream" />}
      {localStream && (
        <Button
          title="Click to start call"
          onPress={createOffer}
          disabled={!!remoteStream}
        />
      )}

      {localStream && (
        <View style={styles.toggleButtons}>
          <Button title="Switch camera" onPress={switchCamera} />
          <Button
            title={`${isMuted ? 'Unmute' : 'Mute'} stream`}
            onPress={createAnswer}
          />
        </View>
      )}

      <View style={styles.rtcview}>
        {localStream && (
          <RTCView style={styles.rtc} streamURL={localStream.toURL()} />
        )}
      </View>
      <View style={styles.rtcview}>
        {remoteStream && (
          <RTCView style={styles.rtc} streamURL={remoteStream.toURL()} />
        )}
      </View>
      <Button
        title="Click to stop call"
        onPress={closeStreams}
        disabled={!remoteStream}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#313131',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  text: {
    fontSize: 30,
  },
  rtcview: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '40%',
    width: '80%',
    backgroundColor: 'black',
  },
  rtc: {
    width: '80%',
    height: '100%',
  },
  toggleButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default withSocket(Room);
