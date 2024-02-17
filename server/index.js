const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log(`a user connected ${socket.id}`);
  
  socket.on("send_message", (data) => {
    console.log(data,"data from clienttt")
    // socket.broadcast.emit("receive_message", data);
   // socket.emit("receive_message", data);
  });
  
});
server.listen(4000, () => {
  console.log("listening on *:4000");
});
