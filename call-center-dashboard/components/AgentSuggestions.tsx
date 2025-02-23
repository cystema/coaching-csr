"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ReloadIcon } from "@radix-ui/react-icons"

interface AgentSuggestionsProps {
  callId: string | null
}

export default function AgentSuggestions({ callId }: AgentSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!callId) return

    const fetchSuggestions = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`https://csr-coaching-shvbham.replit.app/agent-suggestions/${callId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setSuggestions(data.suggestions)
      } catch (e) {
        console.error("Failed to fetch suggestions:", e)
        setError("Failed to fetch agent suggestions. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
    const interval = setInterval(fetchSuggestions, 10000) // Refresh every 10 seconds

    return () => clearInterval(interval)
  }, [callId])

  if (!callId) {
    return (
      <Alert>
        <AlertDescription>Please select a call to view agent suggestions.</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Loading suggestions...
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
        <CardTitle>Agent Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.length > 0 ? (
          <ul className="list-disc pl-5">
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        ) : (
          <p>No suggestions available yet.</p>
        )}
      </CardContent>
    </Card>
  )
}

