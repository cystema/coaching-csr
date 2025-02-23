import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LiveCalls from "@/components/LiveCalls"
import LiveTranscription from "@/components/LiveTranscription"
import AgentSuggestions from "@/components/AgentSuggestions"
import AgentPerformance from "@/components/AgentPerformance"

export default function Dashboard() {
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null)

  return (
    <div className="flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-3xl font-bold tracking-tight">Call Center Dashboard</h1>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Tabs defaultValue="live-calls" className="space-y-4">
          <TabsList>
            <TabsTrigger value="live-calls">Live Calls</TabsTrigger>
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="suggestions">Agent Suggestions</TabsTrigger>
            <TabsTrigger value="performance">Agent Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="live-calls" className="space-y-4">
            <LiveCalls onSelectCall={setSelectedCallId} />
          </TabsContent>
          <TabsContent value="transcription" className="space-y-4">
            <LiveTranscription callId={selectedCallId} />
          </TabsContent>
          <TabsContent value="suggestions" className="space-y-4">
            <AgentSuggestions callId={selectedCallId} />
          </TabsContent>
          <TabsContent value="performance" className="space-y-4">
            <AgentPerformance />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

