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
// import {v1 as uuid} from 'uuid';np
const Home = (props) => {
  const [show, setShow] = useState(false);
  const [callingFriend, setCallingFriend] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [dialCall, setDialCall] = useState(false);
  const {socket} = props;
  useEffect(() => {
    if (dialCall) setCallingFriend(true);
  }, [dialCall]);
  useEffect(() => {
    console.log(socket.id, 'ID');
    socket.emit('peerId', socket.id);
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
          callingFriend={callingFriend}
          receivingCall={receivingCall}
          dialCall={dialCall}
          caller={caller}
          callingFriend={callingFriend}
          handleCancle={handleCancle}
          setCaller={setCallingFriend}
          setReceivingCall={setReceivingCall}
          setDialCall={setDialCall}
          setCallerSignal={setCallerSignal}
          setCallingFriend={setCallerSignal}
          setShow={setShow}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default withSocket(Home);
