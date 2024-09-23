import React, { useEffect, useState, useRef } from "react"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import io from "socket.io-client"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { ScrollArea } from "../components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Mic, MicOff, Volume2, VolumeX, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Progress } from "../components/ui/progress"

const socket = io.connect("http://localhost:4000")

export default function Home() {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition()
  const [botResponse, setBotResponse] = useState("")
  const [lastTranscriptUpdateTime, setLastTranscriptUpdateTime] = useState(Date.now())
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [apiData, setApiData] = useState(null); // To hold the API response data
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0)
  const [isBotSpeaking, setIsBotSpeaking] = useState(false)
  const audioContext = useRef(null)
  const audioAnalyser = useRef(null)
  const audioSource = useRef(null)

  useEffect(() => {
    const transcriptUpdateTimeout = setTimeout(() => {
      if (Date.now() - lastTranscriptUpdateTime >= 2000) {
        socket.emit("send_message", { message: transcript })
      }
    }, 2000)

    return () => clearTimeout(transcriptUpdateTimeout)
  }, [transcript, lastTranscriptUpdateTime])

  useEffect(() => {
    socket.on("receive_message", async(data) => {
      if (data) {
        await gooeyAPI(data)
        setBotResponse(data)
        handleBotResponse(data)
      }
      resetTranscript()
    })

    return () => {
      socket.off("receive_message")
    }
  }, [])

  useEffect(() => {
    setLastTranscriptUpdateTime(Date.now())
  }, [transcript])

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 500)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const handleBotResponse = (text) => {
    SpeechRecognition.stopListening()
    setIsBotSpeaking(true)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onend = () => {
      setIsBotSpeaking(false)
      if (isAudioOn) {
        SpeechRecognition.startListening({ continuous: true })
      }
    }

    speechSynthesis.speak(utterance)
  }

  const startListening = async () => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext()
      audioAnalyser.current = audioContext.current.createAnalyser()
      audioAnalyser.current.fftSize = 2048
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioSource.current = audioContext.current.createMediaStreamSource(stream)
      audioSource.current.connect(audioAnalyser.current)

      SpeechRecognition.startListening({ continuous: true })
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopListening = () => {
    SpeechRecognition.stopListening()
    if (audioSource.current) {
      audioSource.current.disconnect()
    }
  }

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn)
    if (isAudioOn) {
      speechSynthesis.cancel()
      stopListening()
    } else if (!isBotSpeaking) {
      startListening()
    }
  }

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&apos;t support speech recognition.</span>
  }

  const gooeyAPI = async (content) => {
    try {
      const payload = {
        "text_prompt": content,
        "tts_provider": "OPEN_AI",
        "elevenlabs_voice_name": null,
        "elevenlabs_voice_id": "ODq5zmih8GrVes37Dizd",
        "input_face": "https://storage.googleapis.com/dara-c1b52.appspot.com/daras_ai/media/4a63cb18-7945-11ef-bf5c-02420a00010b/csm2.jpg",
        "elevenlabs_api_key": null
      };
      const response = await fetch("https://api.gooey.ai/v2/LipsyncTTS", {
        method: "POST",
        headers: {
          "Authorization": "bearer " + "sk-Er5pVmsgG1BSAPcjqsM7Z23aH4wy8fx2YmFvVqXPKRjNmzfq",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(response.status, result);
      setApiData(result); // Store API response data
      setLoading(false); // Stop loading once dat
    } catch (error) {
      console.error("API call failed:", error);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  useEffect(() => {
    console.log(apiData)
    if (apiData) {
      console.log(apiData.output.output_video, "???")
    }
  }, [apiData])
  const test = () => {
    gooeyAPI()
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center p-8">
      {/* <Button onClick={test}>Test</Button> */}
   
      <Card className="w-full max-w-6xl mb-10 overflow-hidden shadow-xl">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-3xl font-bold text-center">AI CSM Assistant</CardTitle>
          <CardDescription className="text-center text-primary-foreground/80">Your personal AI-powered CSM coach</CardDescription>
        </CardHeader>
        <CardContent className="p-6 h-[10]">
          <Tabs defaultValue="video" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>
            <TabsContent value="video" className="mt-4">
              <ScrollArea className="h-64 w-full rounded-md border p-4">
              {apiData && (
        <div>
          {/* {video}url{apiData.output.output_video} */}
          <video width="320" height="240" controls autoPlay>
            <source src={apiData.output.output_video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="transcript" className="mt-4">
              <ScrollArea className="h-64 w-full rounded-md border p-4">
                <p className="text-gray-700">{transcript}</p>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
        <Button
          onClick={listening ? stopListening : startListening}
          className={`${listening ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            } text-white py-2 px-6 rounded-lg shadow-md transition-all flex items-center gap-2`}
          disabled={isBotSpeaking}
        >
          {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          {listening ? "Stop Listening" : "Start Listening"}
        </Button>
        <Button
          onClick={toggleAudio}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          {isAudioOn ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          {isAudioOn ? "Mute Audio" : "Unmute Audio"}
        </Button>
      </div>

      <Card className="mt-6 w-full max-w-6xl shadow-lg">
        <CardHeader className="bg-secondary text-secondary-foreground flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            AI Response
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {isBotSpeaking ? "Speaking..." : "Analyzing..."}
          </Badge>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-start space-x-4 mb-4">
            <Avatar>
              <AvatarImage src="/ai-avatar.png" alt="AI" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">AI Assistant</h4>
              <p className="text-sm text-muted-foreground">Here to help with your  CSM Queries</p>
            </div>
          </div>
          <Separator className="my-4" />
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <p className="text-gray-700 whitespace-pre-wrap">{botResponse}</p>
          </ScrollArea>
          <Separator className="my-4" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Analysis Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}