"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ReloadIcon } from "@radix-ui/react-icons"

interface LiveTranscriptionProps {
  callId: string | null
}

export default function LiveTranscription({ callId }: LiveTranscriptionProps) {
  const [transcript, setTranscript] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!callId) return

    const fetchTranscription = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`https://csr-coaching-shvbham.replit.app/live-transcriptions/${callId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setTranscript(data.transcript)
      } catch (e) {
        console.error("Failed to fetch transcription:", e)
        setError("Failed to fetch transcription. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTranscription()
    const interval = setInterval(fetchTranscription, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [callId])

  if (!callId) {
    return (
      <Alert>
        <AlertDescription>Please select a call to view the transcription.</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Loading transcription...
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Transcription</CardTitle>
      </CardHeader>
      <CardContent>
        {transcript ? <pre className="whitespace-pre-wrap">{transcript}</pre> : <p>No transcription available yet.</p>}
      </CardContent>
    </Card>
  )
}

