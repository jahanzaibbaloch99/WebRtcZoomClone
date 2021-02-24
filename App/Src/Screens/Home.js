import React, {useState, useEffect, useRef} from 'react';
import {SafeAreaView, View, TouchableOpacity, Text, Modal} from 'react-native';
import {
  RTCPeerConnection,
  mediaDevices,
  RTCView,
  RTCSessionDescription,
  RTCIceCandidate,
} from 'react-native-webrtc';
import {withSocket} from '../Utils/withSocket';
import CallScreen from '../Screens/CallScreen';
import Peer from 'react-native-peerjs';

const Home = (props) => {
  const localPeer = new Peer();
  const [show, setShow] = useState(false);
  const [callingFriend, setCallingFriend] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [dialCall, setDialCall] = useState(false);
  const {socket} = props;
  const [peerId, setPeerId] = useState('');
  const [remoteId, setRemoteId] = useState('');
  const remotePeer = new Peer();
  useEffect(() => {
    localPeer.on('open', (data) => {
      setPeerId(data);
    });
  }, []);
  useEffect(() => {
    remotePeer.on('open', (data) => {
      setRemoteId(data);
    });
  }, []);
  useEffect(() => {
    if (dialCall) setCallingFriend(true);
  }, [dialCall]);
  useEffect(() => {
    socket.on('hey-212121', (data) => {
      setShow(true), setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, [socket]);
  const onCreate = () => {
    props.navigation.navigate('Rooms', {
      id: '121yef8sy18q7fsga804g',
    });
  };
  const onNewEnter = () => {
    props.navigation.navigate('New', {
      room: '1234',
    });
  };
  const handleCancle = () => {
    setShow(false);
    setDialCall(false);
  };
  const startCall = () => {
    setShow(true);
    setDialCall(true);
    setCaller('121212');
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
          onPress={startCall}
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
        <TouchableOpacity
          onPress={onNewEnter}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            height: 50,
            width: '60%',
            backgroundColor: 'red',
          }}>
          <Text>CREATE NEW ROOM</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={show} onRequestClose={handleCancle}>
        <CallScreen
          localPeer={localPeer}
          callingFriend={callingFriend}
          receivingCall={receivingCall}
          dialCall={dialCall}
          caller={caller}
          remoteId={remoteId}
          setRemoteId={setRemoteId}
          callingFriend={callingFriend}
          handleCancle={handleCancle}
          setCaller={setCallingFriend}
          setReceivingCall={setReceivingCall}
          setDialCall={setDialCall}
          setCallerSignal={setCallerSignal}
          setCallingFriend={setCallerSignal}
          setShow={setShow}
          peerId={peerId}
          setPeerId={setPeerId}
          remotePeer={remotePeer}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default withSocket(Home);
