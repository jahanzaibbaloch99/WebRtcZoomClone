const express = require("express");
const http = require("http");
const socket = require("socket.io");
const morgan = require("morgan");
const { ExpressPeerServer } = require("peer");
const { compile } = require("morgan");
const app = express();

const server = http.createServer(app);
const io = socket(server).sockets;

app.use(express.json());
io.on("connection", (socket) => {
  socket.on("callUser", (data) => {
    console.log("call user", data.userToCall);
    io.emit(`hey-${data.userToCall}`, {
      signal: data.signalData,
      from: data.from,
    });
  });
  socket.on("peerId", (id) => {
    const newId = Boolean(id !== socket.id);
    console.log(id, "OD");
    console.log(socket.id, "SOCKET");
    console.log(newId, "NEWID");
   
      io.emit("peerId", socket.id);
    
  });

  socket.on("acceptCall", (data) => {
    console.log("check accpt call", data.to);
    io.emit(`callAccepted-${data.to}`, data.signal);
  });

  socket.on("close", (data) => {
    console.log("check close call", data);
    io.emit(`close-${data.to}`);
  });

  socket.on("rejected", (data) => {
    console.log("check close call", data.to);
    io.emit(`rejected-${data.to}`);
  });
  console.log("connected ");
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server Is Running On Port ${port}`));
