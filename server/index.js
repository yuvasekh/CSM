const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
let apirouter = require("./routers/router");
const {botreply}=require('./controllers/Bot.controller')
app.use("/api", apirouter);
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection",async (socket) => {
  console.log(`a user connected ${socket.id}`);

  socket.on("send_message", async(data) => {
    console.log(data, "data from clienttt");
    if(data.message!="" || data.message!="" )
    {
      console.log("Inisde call")
      var reply=  await botreply(data.message).then((res)=>
      {
        // console.log(res,"checl")
        // console.log(reply,'reply')
        socket.emit("receive_message", res);
      })
  
    }
    else{
      // socket.emit("receive_message", res);
     }
  
    // socket.broadcast.emit("receive_message", data);

  });
});
server.listen(4000, () => {
  console.log("listening on *:4000");
});