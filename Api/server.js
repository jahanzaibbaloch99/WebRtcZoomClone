const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
let rooms = {};
app.use(express.json());
const io = socketio(server).sockets;
io.on("connection", (socket) => {
  socket.on("join room", (roomID) => {
    if (rooms[roomID]) {
      rooms[roomID] = [socket.id];
    } else {
      rooms[roomID] = [socket.id];
    }
    const otherUser = rooms[roomID].find((id) => id !== socket.id);
    if (otherUser) {
      socket.emit("other user", otherUser);
      socket.to(otherUser).emit("user joined", socket.id);
    }
  });
  socket.on("offer", (payload) => {
    io.to(payload.target).emit("offer", payload);
  });
  socket.on("answer", (payload) => {
    io.to(payload.target).emit("answer", payload);
  });
  socket.on("ice-canditate", (incoming) => {
    io.to(incoming.target).emit("ice-canditate", incoming.canditate);
  });
});
// const customGenerationFunction = () => {
//   return (Math.random().toString(36) + "0000000000000000000").substr(2, 16);
// };
// const peerServer = ExpressPeerServer(server, {
//   debug: true,
//   path: "/",
//   generateClientId: customGenerationFunction,
// });
// app.use("/mypeer", peerServer);

// io.on("connection", function (socket) {
//   socket.on("join-room", ({ roomID, userId }) => {
//     console.log("JOIN ROOM", roomID);
//     socket.join(roomID);
//     socket.to(roomID).broadcast.emit("user-connected", userId);
//   });
// });
const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`server is Running on Port ${port}`));
