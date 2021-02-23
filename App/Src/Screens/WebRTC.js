import React, {useState, useEffect, useLayoutEffect} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {
  RTCView,
  mediaDevices,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
} from 'react-native-webrtc';
import WebSocketClient from 'reconnecting-websocket';

const dimensions = Dimensions.get('window');

const host = '192.168.18.148:5000';
const id = '_' + Math.random().toString(36).substr(2, 9);
let remoteId = null;
let connection = null;

const WebRTC = ({route, navigation}) => {
  const room = route.params.room;
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({headerTitle: `Room ${room}`});
  });

  useEffect(() => {
    const ws = new WebSocketClient(`ws://${host}`);

    ws.onopen = () => {
      console.log('Connected');
    };

    ws.onerror = (err) => {
      console.log('Got error:', err);
    };

    ws.onmessage = async (message) => {
      console.log('Got message:', message);
      const data = JSON.parse(message.data);
      switch (data.type) {
        case 'enter':
          await onEnter(data.success, data.full, data.wait);
          break;
        case 'offer':
          await onOffer(data.offer, data.remoteId);
          break;
        case 'answer':
          await onAnswer(data.answer);
          break;
        case 'candidate':
          await onCandidate(data.candidate);
          break;
        case 'leave':
          await onLeave();
          break;
        default:
          break;
      }
    };

    const send = (message) => {
      message.room = room;
      if (remoteId) {
        message.remoteId = remoteId;
      }
      message.id = id;
      ws.send(JSON.stringify(message));
    };

    const onEnter = async (success, full, wait) => {
      if (success) {
        if (wait) {
          startConnection();
        } else {
          startConnection(true);
        }
      } else {
        if (full) {
          //TODO: full
        } else {
          //TODO:
        }
      }
    };

    const startConnection = (startPC = false) => {
      const isFront = true;

      const facingMode = isFront ? 'user' : 'environment';
      const constraints = {
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode,
        },
      };
      mediaDevices
        .getUserMedia(constraints)
        .then(async (stream) => {
          setLocalStream(stream);
          await setupPeerConnection(stream, startPC);
        })
        .catch((err) => console.error(err));
    };

    const setupPeerConnection = async (stream, startPC = false) => {
      const configuration = {
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302',
          },
        ],
      };
      const conn = new RTCPeerConnection(configuration);
      connection = conn;

      conn.addStream(stream);
      conn.onaddstream = (event) => setRemoteStream(event.stream);

      conn.onicecandidate = (event) => {
        if (event.candidate) {
          send({
            type: 'candidate',
            candidate: event.candidate,
          });
        }
      };

      if (startPC) {
        await startPeerConnection();
      }
    };

    const startPeerConnection = async () => {
      try {
        const offer = await connection.createOffer();
        send({
          type: 'offer',
          offer,
        });
        await connection.setLocalDescription(offer);
      } catch (err) {
        console.error(err);
      }
    };

    const onOffer = async (offer, remote) => {
      remoteId = remote;
      await connection.setRemoteDescription(new RTCSessionDescription(offer));

      try {
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
        send({
          type: 'answer',
          answer,
        });
      } catch (err) {
        console.error(err);
      }
    };

    const onAnswer = async (answer) =>
      await connection.setRemoteDescription(new RTCSessionDescription(answer));

    const onCandidate = async (candidate) =>
      await connection.addIceCandidate(new RTCIceCandidate(candidate));

    const onLeave = async () => {
      remoteId = null;
      setRemoteStream(null);
      connection.close();
      connection.onaddstream = null;
      connection.onicecandidate = null;
      startConnection();
    };

    if (room.length > 0) {
      send({
        type: 'enter',
        id,
      });
    } else {
      // Error
    }

    const unsubscribe = navigation.addListener('blur', () => {
      connection.close();
      connection.onaddstream = null;
      connection.onicecandidate = null;
      send({
        type: 'leave',
      });
    });
    return unsubscribe;
  }, [navigation, room]);

  return (
    <View style={styles.container}>
      <View style={styles.video}>
        <View style={styles.localVideo}>
          <View style={styles.videoWidget}>
            {localStream && (
              <RTCView streamURL={localStream.toURL()} style={styles.rtcView} />
            )}
          </View>
        </View>
        <View style={styles.remoteVideo}>
          <View style={styles.videoWidget}>
            {remoteStream && (
              <RTCView
                streamURL={remoteStream.toURL()}
                style={styles.rtcView}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  video: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    backgroundColor: '#eee',
    alignSelf: 'stretch',
  },
  localVideo: {
    flex: 0.5,
    backgroundColor: '#faa',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  remoteVideo: {
    flex: 0.5,
    backgroundColor: '#aaf',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  videoWidget: {
    position: 'relative',
    flex: 0.5,
    backgroundColor: '#fff',
    width: dimensions.width / 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  rtcView: {
    flex: 1,
    width: dimensions.width / 2,
    backgroundColor: '#f00',
    position: 'relative',
  },
});

export default WebRTC;
