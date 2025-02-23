"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ReloadIcon } from "@radix-ui/react-icons"
import useFetchCalls from "@/hooks/useFetchCalls"

interface LiveCallsProps {
  onSelectCall: (callId: string) => void
}

export default function LiveCalls({ onSelectCall }: LiveCallsProps) {
  const { calls, isLoading, error, fetchCalls, rawResponse } = useFetchCalls()

  useEffect(() => {
    fetchCalls()
    const interval = setInterval(fetchCalls, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [fetchCalls])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Loading...
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={fetchCalls} className="mt-2">
          Retry
        </Button>
        {rawResponse && (
          <div className="mt-4">
            <h4 className="font-bold">Raw Response:</h4>
            <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">{rawResponse}</pre>
          </div>
        )}
      </Alert>
    )
  }

  if (calls.length === 0) {
    return (
      <Alert>
        <AlertTitle>No Live Calls</AlertTitle>
        <AlertDescription>There are currently no active calls.</AlertDescription>
        {rawResponse && (
          <div className="mt-4">
            <h4 className="font-bold">Raw Response:</h4>
            <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">{rawResponse}</pre>
          </div>
        )}
      </Alert>
    )
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {calls.map((call) => (
          <Card key={call.call_id}>
            <CardHeader>
              <CardTitle>Call {call.call_id.slice(0, 8)}...</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Caller: {call.original_caller}</p>
              <p>Started: {new Date(call.started_at).toLocaleString()}</p>
              <Button className="mt-2" onClick={() => onSelectCall(call.call_id)}>
                Select Call
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {rawResponse && (
        <div className="mt-4">
          <h4 className="font-bold">Raw Response:</h4>
          <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">{rawResponse}</pre>
        </div>
      )}
    </div>
  )
}

