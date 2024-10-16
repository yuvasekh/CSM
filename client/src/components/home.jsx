"use client"

import React, { useEffect, useState, useRef } from "react"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import io from "socket.io-client"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { ScrollArea } from "../components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, HeartIcon } from "lucide-react"
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
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isBotSpeaking, setIsBotSpeaking] = useState(false)
  const [videoUrl, setVideoUrl] = useState()
  const [inputFace, setInputFace] = useState("https://storage.googleapis.com/dara-c1b52.appspot.com/daras_ai/media/4a63cb18-7945-11ef-bf5c-02420a00010b/csm2.jpg")
  const [isVideoEnding, setIsVideoEnding] = useState(false)
  const audioContext = useRef(null)
  const audioAnalyser = useRef(null)
  const audioSource = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const transcriptUpdateTimeout = setTimeout(() => {
      if (Date.now() - lastTranscriptUpdateTime >= 2000) {
        socket.emit("send_message", { message: transcript })
      }
    }, 2000)

    return () => clearTimeout(transcriptUpdateTimeout)
  }, [transcript, lastTranscriptUpdateTime])

  useEffect(() => {
    socket.on("receive_message", async (data) => {
      if (data) {
        await gooeyAPI(data.lipsyncdata)
        console.log(data, "socket")
        setBotResponse(data.reply)
        handleBotResponse(data.reply)
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
    setIsBotSpeaking(true)
    SpeechRecognition.stopListening()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onend = () => {
      setIsBotSpeaking(false)
      if (isAudioOn) {
        startListening()
      }
    }

    // speechSynthesis.speak(utterance)
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

  const gooeyAPI = async (result) => {
    try {
      setInputFace("")
      setVideoUrl(result?.output?.output_video)
      setApiData(result)
      setLoading(false)
    } catch (error) {
      console.error("API call failed:", error)
    }
  }

  const handleVideoEnd = () => {
    console.log('end trigger')
    setIsVideoEnding(false);
    setVideoUrl("")
setInputFace("https://storage.googleapis.com/dara-c1b52.appspot.com/daras_ai/media/4a63cb18-7945-11ef-bf5c-02420a00010b/csm2.jpg")
    setIsBotSpeaking(false)
    if (isAudioOn && !isBotSpeaking) {
      startListening(); // Resume listening when the video ends
    }
  };


  const handleVideoPlay = () => {
    if (listening) {
      stopListening()
    }
    setIsVideoEnding(false)
  }

  const handleVideoPause = () => {
    if (isAudioOn && !isBotSpeaking) {
      startListening()
    }
  }

  const handleTimeUpdate = () => {
    console.log("callingtime")
    if (videoRef.current) {
      const timeLeft = videoRef.current.duration - videoRef.current.currentTime
      if (timeLeft <= 3 && !isVideoEnding) {
        setIsVideoEnding(true)
        setIsBotSpeaking(false)
        console.log("Video is ending soon!")
        videoRef.current = null
        // You can add any additional logic here for when the video is about to end
      }
    }
  }

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn&apos;t support speech recognition.</span>
  }

 
  useEffect(() => {

  }, [videoUrl])
  return (
    <div >
      <h1 className="flex justify-center">Made By Yuva {<HeartIcon fill="red" />}</h1>
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center p-8">
      
      <div className="flex gap-20">
      <Card className="w-[700px] h-[570px]  overflow-hidden shadow-xl">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-3xl font-bold text-center">AI CSM Assistant</CardTitle>
          <CardDescription className="text-center text-primary-foreground/80">Your personal AI-powered CSM coach</CardDescription>
        </CardHeader>
        <CardContent className="p-6 ">
          <Tabs defaultValue="video" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>
            <TabsContent value="video" className="mt-4">
  <div>
    {inputFace && (
      <img 
        src={inputFace} 
        className="h-[380px] w-[660px]" // Set height and width for the image
      />
    )}
    {videoUrl && (
      <div className="h-[380px] w-[660px]">
        <video
          ref={videoRef}
          autoPlay
          onEnded={handleVideoEnd}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onTimeUpdate={handleTimeUpdate}

        >
          <source src={videoUrl} type="video/mp4"  className="h-[250px] w-screen/80"/>
          Your browser does not support the video tag.
        </video>
      
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
      <Card className="w-[600px] h-[570px] shadow-lg">
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
              <p className="text-sm text-muted-foreground">Here to help with your CSM Queries</p>
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
      <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
        <Button
          onClick={listening ? stopListening : startListening}
          className={`${listening ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white py-2 px-6 rounded-lg shadow-md transition-all flex items-center gap-2`}
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

    
    </div>
    </div>
  )
}