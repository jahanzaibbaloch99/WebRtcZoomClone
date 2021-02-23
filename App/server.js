

const webSocketServer = require('ws').Server;
const wss = new webSocketServer({port: 5000, host: '0.0.0.0'});
const rooms = {};

wss.on('connection', (connection) => {
  console.log('User connected');

  connection.on('message', (message) => {
    let data;

    try {
      data = JSON.parse(message);
    } catch (e) {
      console.log('Error parsing JSON');
      data = {};
    }

    switch (data.type) {
      case 'enter':
        console.log('User entered room', data.room);
        if (rooms[data.room]) {
          if (Object.keys(rooms[data.room]).length > 1) {
            sendTo(connection, {
              type: 'enter',
              success: false,
              full: true,
              wait: false,
            });
          } else {
            rooms[data.room][data.id] = connection;
            connection.room = data.room;
            connection.id = data.id;
            sendTo(connection, {
              type: 'enter',
              success: true,
              full: false,
              wait: false,
            });
          }
        } else {
          rooms[data.room] = {};
          rooms[data.room][data.id] = connection;
          connection.room = data.room;
          connection.id = data.id;
          sendTo(connection, {
            type: 'enter',
            success: true,
            full: false,
            wait: true,
          });
        }
        break;
      case 'offer':
        {
          const ids = Object.keys(rooms[connection.room]);
          let remoteId, conn;
          if (ids[0] === connection.id) {
            remoteId = ids[1];
            conn = rooms[connection.room][ids[1]];
          } else {
            remoteId = ids[0];
            conn = rooms[connection.room][ids[0]];
          }

          if (conn != null) {
            console.log('Sending offer to', remoteId);
            connection.remoteId = remoteId;
            conn.remoteId = connection.id;
            sendTo(conn, {
              type: 'offer',
              offer: data.offer,
              remoteId: connection.id,
            });
          }
        }
        break;
      case 'answer':
        {
          const conn = rooms[connection.room][data.remoteId];
          if (conn != null) {
            console.log('Sending answer to', data.remoteId);
            connection.remoteId = data.remoteId;
            sendTo(conn, {
              type: 'answer',
              answer: data.answer,
            });
          }
        }
        break;
      case 'candidate':
        {
          console.log('Sending candidate to', connection.remoteId);
          const conn = rooms[connection.room][connection.remoteId];

          if (conn != null) {
            sendTo(conn, {
              type: 'candidate',
              candidate: data.candidate,
            });
          }
        }
        break;
      case 'leave':
        {
          delete rooms[connection.room][connection.id];
          const conn = rooms[connection.room][connection.remoteId];
          if (Object.keys(rooms[connection.room]).length === 0) {
            delete rooms[connection.room];
          }

          if (conn != null) {
            console.log('Disconnecting user from', connection.remoteId);
            conn.remoteId = null;
            sendTo(conn, {
              type: 'leave',
            });
          }
        }
        break;
      default:
        sendTo(connection, {
          type: 'enter',
          message: 'Unrecognized command:' + data.type,
        });
        break;
    }
  });

  connection.on('close', () => {
    console.log('Connection closed');
    if (connection.room) {
      delete rooms[connection.room][connection.id];

      if (connection.remoteId) {
        console.log('Disconnecting user from', connection.remoteId);
        const conn = rooms[connection.room][connection.remoteId];
        conn.remoteId = null;

        if (conn !== null) {
          sendTo(conn, {
            type: 'leave',
          });
        }
      }
    }
  });
});

const sendTo = (conn, message) => {
  conn.send(JSON.stringify(message));
};

wss.on('listening', () => {
  console.log('Server started...');
});