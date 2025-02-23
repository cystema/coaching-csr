"use client"

import { useCallback, useState } from "react"

interface Call {
  call_id: string
  original_caller: string
  started_at: string
  transcript: string
}

const useFetchCalls = () => {
  const [calls, setCalls] = useState<Call[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rawResponse, setRawResponse] = useState<string | null>(null)

  const fetchCalls = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setRawResponse(null)
    try {
      const response = await fetch("https://csr-coaching-shvbham.replit.app/live-calls", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })

      const responseText = await response.text()
      setRawResponse(responseText)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError)
        throw new Error("Failed to parse server response")
      }

      setCalls(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error("Error fetching calls:", e)
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { calls, isLoading, error, fetchCalls, rawResponse }
}

export default useFetchCalls

