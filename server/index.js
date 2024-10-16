const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
let apirouter = require("./routers/router");
const { botreply } = require('./controllers/Bot.controller')
var bodyParser = require('body-parser')
app.use("/api", apirouter);
app.use(bodyParser.json())
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});
// Ensure you import the required modules if necessary
const fetch = require('node-fetch'); // if needed

app.post('/lipsync', async (req, res) => {
  try {
    console.log(req.body, "request from client");

    const payload = {
      text_prompt: req.body.content,
      tts_provider: "OPEN_AI",
      elevenlabs_voice_name: null,
      elevenlabs_voice_id: "ODq5zmih8GrVes37Dizd",
      input_face: "https://storage.googleapis.com/dara-c1b52.appspot.com/daras_ai/media/4a63cb18-7945-11ef-bf5c-02420a00010b/csm2.jpg",
      elevenlabs_api_key: null,
    };
    const response = await fetch("https://api.gooey.ai/v2/LipsyncTTS", {
      method: "POST",
      headers: {
        "Authorization": "bearer " + process.env["GOOEY_API_KEY"],
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(response.status);
    }
    const result = await response.json();
    console.log(response.status, result);
    res.status(200).send(result);


  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'An error occurred while processing the request' });
  }
});
async function lipsync(content) {
  try {
    // console.log(content,"request from client");
//https://storage.googleapis.com/dara-c1b52.appspot.com/daras_ai/media/d80892b0-7971-11ef-812d-02420a00010b/laxman.jpg
    const payload = {
      text_prompt: content,
      tts_provider: "OPEN_AI",
      elevenlabs_voice_name: null,
      elevenlabs_voice_id: "ODq5zmih8GrVes37Dizd",
      input_face: "https://storage.googleapis.com/dara-c1b52.appspot.com/daras_ai/media/4a63cb18-7945-11ef-bf5c-02420a00010b/csm2.jpg",
      elevenlabs_api_key: null,
    };
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const response = await fetch("https://api.gooey.ai/v2/LipsyncTTS", {
      method: "POST",
      headers: {
        "Authorization": "bearer " + process.env["GOOEY_API_KEY"],
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(response.status);
    }
    const result = await response.json();
    // console.log(response.status, result);
    return result


  } catch (error) {
    console.error('Error:', error);
    return error
  }
}
io.on("connection", async (socket) => {
  console.log(`a user connected ${socket.id}`);

  socket.on("send_message", async (data) => {
    console.log(data, "data from client");

    // Ensure the message is not empty
    if (data.message && data.message.trim() !== "") {
      console.log("Inside call");

      try {
        
        var reply = await botreply(data.message);
        console.log(reply, "bot reply");

        var lipsyncdata = await lipsync(reply);
        console.log(lipsyncdata, "lipsyncdata");
        // Emit both the bot reply and lipsync data
        socket.emit("receive_message", { reply: reply, lipsyncdata: lipsyncdata });
      } catch (error) {
        console.error("Error handling bot reply or lipsync:", error);
      }
    } else {
      console.log("Empty message received");
    }
  });

});
server.listen(4000, () => {
  console.log("listening on *:4000");
});