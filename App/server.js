
// const express = require("express");
// const http = require("http");
// const app = express();
// const server = http.createServer(app);
// const socket = require("socket.io");
// const io = socket(server);

// const rooms = {};
// io.origins("*:*");

// io.on("connection", (socket) => {
//   console.log("a user connected to socket");
//   socket.on("joinTheRoom", (room) => {
//     console.log("create or join to room", room);
//     const myRoom = io.sockets.adapter.rooms[room] || { length: 0 };
//     const numClients = myRoom.length;
//     console.log(room, "has", numClients, "clients");

//     if (numClients == 0) {
//       socket.join(room);
//       socket.emit("roomCreated", room);
//     } else if (numClients > 0) {
//       socket.join(room);
//       socket.emit("roomJoined", room);
//     } else {
//       socket.emit("full", room);
//     }
//   });

//   socket.on("ready", (room) => {
//     console.log("ready");

//     socket.emit("ready");
//   });

//   socket.on("candidate", (event) => {
//     console.log("candidate");
//     socket.emit("candidate", event);
//   });

//   socket.on("offer", (event) => {
//     console.log("offer");
//     socket.emit("offer", event.sdp);
//   });

//   socket.on("answer", (event) => {
//     console.log("answer");
//     socket.broadcast.to(event.room).emit("answer", event.sdp);
//   });
// });
// const port = process.env.PORT || 5000;

// server.listen(port, () => console.log(`server is Running on Port ${port}`));
