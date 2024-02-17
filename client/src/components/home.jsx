import React from 'react'



import { useEffect } from "react";
import io from "socket.io-client";
const socket = io.connect("http://localhost:4000");

function Home() {
  function sendMessage() {
    console.log("Button clicked");
    socket.emit("send_message", { message: "Hello from ajay relli" });
  }

  socket.on("receive_message", (data) => {
    console.log("to the console from back end",data)
  });
  useEffect(() => {
    socket.on("receive_message", (data) => {
      alert(data.message);
    });
  }, [socket]);

  return (
    <div className="App">
      <input placeholder="Message" />
      <button onClick={sendMessage}>Send message</button>
    </div>
  );
}
export default Home