"use client"

import React, { useEffect, useState, useRef } from "react"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import io from "socket.io-client"
import ReactPlayer from "react-player"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { ScrollArea } from "../components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Mic, MicOff, Video, VideoOff, Volume2, VolumeX, MessageSquare, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Progress } from "../components/ui/progress"
import Speech, { HighlightedText, useSpeech } from "react-text-to-speech";

const socket = io.connect("http://localhost:4000")

export default function Home() {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition()
  const [stream, setStream] = useState(null)
  const [botResponse, setBotResponse] = useState("")
  const [lastTranscriptUpdateTime, setLastTranscriptUpdateTime] = useState(Date.now())
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [activeTab, setActiveTab] = useState("video")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const transcriptUpdateTimeout = setTimeout(() => {
      if (Date.now() - lastTranscriptUpdateTime >= 2000) {
        socket.emit("send_message", { message: transcript })
      }
    }, 2000)

    return () => clearTimeout(transcriptUpdateTimeout)
  }, [transcript, lastTranscriptUpdateTime])

  useEffect(() => {
    if (isVideoOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        setStream(stream)
      })
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        setStream(null)
      }
    }
  }, [isVideoOn])

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data) {
        setBotResponse(data)
      
          speakBotResponse(data)
        
      }
      resetTranscript()
    })

    return () => {
      socket.off("receive_message")
    }
  }, [isAudioOn])

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

  const speakBotResponse = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    speechSynthesis.speak(utterance)
  }

  const startListening = () => SpeechRecognition.startListening({ continuous: true })
  const stopListening = () => SpeechRecognition.stopListening()

  const toggleVideo = () => setIsVideoOn(!isVideoOn)
  const toggleAudio = () => setIsAudioOn(!isAudioOn)

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>
  }  useEffect(() => {
    console.log(botResponse, "botresponsess");
    if (botResponse) {
      start();
    }
  }, [botResponse]);
  const { Text, speechStatus, start, pause, stop } = useSpeech({
    text: <div>{botResponse}</div>,
    highlightText: true,
    highlightProps: {
      style: { color: "black", backgroundColor: "cement", fontSize: "20px" },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center p-8">
      <Card className="w-full max-w-6xl mb-10 overflow-hidden shadow-xl">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-3xl font-bold text-center">AI CSM Assistant</CardTitle>
          <CardDescription className="text-center text-primary-foreground/80">Your personal AI-powered CSM coach</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>
            <TabsContent value="video" className="mt-4">
              <div className="w-full bg-black rounded-lg overflow-hidden shadow-inner">
                {isVideoOn ? (
                  <ReactPlayer
                    url={stream}
                    playing={true}
                    muted={true}
                    width="100%"
                    height="auto"
                    className="rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center text-white text-2xl bg-gray-800">
                    Video is off
                  </div>
                )}
              </div>
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
          className={`${listening ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white py-2 px-6 rounded-lg shadow-md transition-all flex items-center gap-2`}
        >
          {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          {listening ? 'Stop Listening' : 'Start Listening'}
        </Button>
        <Button
          onClick={toggleVideo}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          {isVideoOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          {isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
        </Button>
        <Button
          onClick={toggleAudio}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          {isAudioOn ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          {isAudioOn ? 'Mute Audio' : 'Unmute Audio'}
        </Button>
      </div>

      <Card className="mt-6 w-full max-w-6xl shadow-lg">
        <CardHeader className="bg-secondary text-secondary-foreground flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            AI Response
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Analyzing...
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
              <p className="text-sm text-muted-foreground">Here to help with your interview preparation</p>
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