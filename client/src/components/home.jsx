
import React, { useEffect, useState, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import io from "socket.io-client";

import ReactPlayer from "react-player";
const socket = io.connect("http://localhost:4000");

function Home() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const userVideo = useRef();
  const [stream, setStream] = useState(null);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  const test = () => {
    SpeechRecognition.startListening({ continuous: true });
  };
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        setStream(stream);
      });
  });


  socket.on("receive_message", (data) => {
    console.log("to the console from back end", data);
  });
  useEffect(() => {
    // socket.on("receive_message", (data) => {
    //   alert(data.message);
    // });
  }, [socket]);

  useEffect(()=>{
    socket.emit("send_message", { message: transcript });

  },[transcript])

const resetTranscriptData =()=>{
 resetTranscript()
}
  return (
    <div className="App">
      <div>
        <ReactPlayer
          url={stream}
          playing={true}
          // controls={true}
          muted={true}
          width="300px"
        />
        <p style={{ color: "blue" }}>Microphone: {listening ? "on" : "off"}</p>
        <button onClick={test}>Start</button>
        <button onClick={SpeechRecognition.stopListening}>Stop</button>
        <button onClick={resetTranscriptData}>Reset</button>
        <p style={{ color: "blue" }}>{transcript}</p>
      </div>
    </div>
  );
}
export default Home;
