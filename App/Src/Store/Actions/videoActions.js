import {ADD_REMOTE_STREAM, ADD_STREAM, JOIN_CHAT, MY_STREAM} from './types';
import IO from 'socket.io-client';

import Peer from 'react-native-peerjs';

export const API_URI = `192.168.18.148:5000`;
const socket = IO(`${API_URI}`, {
  forceNew: true,
});
socket.on('connection', () => {
  console.log('Connected Client');
});

export const joinRoom = (stream) => {
  const roomID = 'asdfjklasjdflkj89uqwioruoweu';
  return async (dispatch) => {
    const peerServer = new Peer(undefined, {
      host: '192.168.18.148',
      secure: false,
      port: 5000,
      path: '/mypeer',
    });
    peerServer.on('error', console.log);
    dispatch({
      type: 'MY_STREAM',
      payload: {Stream: stream},
    });

    peerServer.on('open', (userId) => {
      console.log('JOIN ROOM');
      socket.emit('join-room', {userId, roomID});
    });

    socket.on('user-connected', (userId) => {
      console.log('USER CONNECTED');
      const call = peerServer.call(userId, stream);
    });

    peerServer.on('call', (call) => {
      call.answer(stream);
      call.on('stream', (stream) => {
        console.log(stream, 'STREAM otger');
        dispatch({
          type: 'ADD_STREAM',
          payload: stream,
        });
      });
    });
  };
};
