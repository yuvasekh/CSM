import React, { useEffect, useState, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import io from "socket.io-client";
import Speech, { HighlightedText, useSpeech } from "react-text-to-speech";
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
  const [botResponse, setBotResponse] = useState("");

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  const test = () => {
    SpeechRecognition.startListening({ continuous: true });
  };
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
      });
  });

  socket.on("receive_message", (data) => {
    setBotResponse(data);
    console.log("to the console from back end", data);
  });

  useEffect(() => {
    socket.emit("send_message", { message: transcript });
  }, [transcript]);

  const { Text, speechStatus, start, pause, stop } = useSpeech({
    text: <div>{botResponse}</div>,
    highlightText: true,
    highlightProps: {
      style: { color: "black", backgroundColor: "cement", fontSize: "20px" },
    },
  });
  const resetTranscriptData = () => {
    resetTranscript();
  };

  return (
    <div className="h-full w-full">
      <div className="flex flex-row p-10 items-start ">
        <div className="w-[60%]">
          <ReactPlayer
            url={stream}
            playing={true}
            // controls={true}
            muted={true}
            width="100%"
          />
        </div>
        <div className="flex flex-col gap-5  justify-center items-center w-[40%]">
          <div className="">
            <div className="flex gap-2">
              <div className="bg-slate-500 h-[40%] w-[40%] text-miracle-black">
                <Text />
              </div>

              {speechStatus !== "started" ? (
                <button onClick={start}>Start</button>
              ) : (
                <button onClick={pause}>Pause</button>
              )}
              <button onClick={stop}>Stop</button>
            </div>
          </div>

          <div className="text-miracle-black">user response</div>
        </div>

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
