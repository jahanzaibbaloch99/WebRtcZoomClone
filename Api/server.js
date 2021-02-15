const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const morgan = require("morgan");

const { ExpressPeerServer } = require("peer");
const app = express();
const server = http.createServer(app);

app.use(express.json());
const io = socketio(server).sockets;
const customGenerationFunction = () =>
  (Math.random().toString(36) + "0000000000000000000").substr(2, 16);
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/",
  generateClientId: customGenerationFunction,
});
app.use("/mypeer", peerServer);

io.on("connection", function (socket) {
  console.log("CONECTED");
});
const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`server is Running on Port ${port}`));
