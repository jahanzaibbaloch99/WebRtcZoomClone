import React from 'react';
import SocketIOClinet from 'socket.io-client';
const API_URI = `192.168.18.148:5000`;
const socket = SocketIOClinet.connect(`192.168.18.148:5000`);
export const withSocket = (Component) => {
  return class extends React.Component {
    render() {
      return <Component {...this.props} socket={socket} />;
    }
  };
};
