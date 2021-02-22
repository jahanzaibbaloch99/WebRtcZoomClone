const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const rooms = {};
io.on("connection", (socket) => {
  socket.on("join room", (roomID) => {
    if (rooms[roomID]) {
      rooms[roomID].push(socket.id);
    } else {
      rooms[roomID] = [socket.id];
    }
    const otherUser = rooms[roomID].find((id) => id !== socket.id);
    if (otherUser) {
      socket.emit("other user", otherUser);
      io.emit("user joined", socket.id);
    }
  });

  socket.on("offer", (payload) => {
    console.log(payload, "PAYL oofer");
    socket.emit("offer", payload);
  });

  socket.on("answer", (payload) => {
    console.log(payload, "ANSWER PAYLOAD");
    socket.emit("answer", payload);
  });

  socket.on("ice-candidate", (incoming) => {
    console.log(incoming, "ICONS");
    socket.emit("ice-candidate", incoming.candidate);
  });
});
const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`server is Running on Port ${port}`));
