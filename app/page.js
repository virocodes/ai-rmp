'use client'
import { Card, CardHeader, CardContent, CardFooter  } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown'
import Image from "next/image";
import { useState } from "react";

export default function Home() {

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm the Rate My Professor support assistant. How can I help you today?"
    }
  ])
  const [message, setMessage] = useState('')
  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      {role: "user", content: message},
      {role: "assistant", content: ''}
    ])

    setMessage('')

    const response = fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, {role: "user", content: message}])
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({done, value}) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), {stream: true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            {...lastMessage, content: lastMessage.content + text},
          ]
        })

        return reader.read().then(processText)
      })
    })

    
  }

  

  return (
    <div className="w-full flex justify-center items-center h-screen">
    <Card className="w-full h-5/6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
        Rate My Professor
      </CardHeader>
      <CardContent className="flex-grow p-4 overflow-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
              <div className={`p-3 rounded-lg ${message.role === "assistant" ? "bg-gray-100" : "bg-purple-500 text-white"}`}>
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex items-center">
        <Input
          className="flex-grow mr-2"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage} className="bg-purple-500 text-white">
          Send
        </Button>
      </CardFooter>
    </Card>
    </div>
  );
}
