"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TopObjectionsChart } from "./top-objections-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CoachingOpportunities } from "./coaching-opportunities"
import { CallsTable } from "./calls-table"
import { useState, useEffect } from "react"
import { HangupMetricsChart } from "./hangup-metrics-chart"

interface AgentDetailsDialogProps {
  agent: AgentPerformance | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface AgentPerformance {
  id: string
  name: string
  isAI: boolean
  totalCalls: number
  bookableCalls: number
  callsBooked: number
  avgTimeOnCall: string
  timeToAnswer: string
  topLostReason: string
  topWinReason: string
  avgPlaybookScore: number
}

// Sample data generator for agent-specific metrics
const generateAgentMetricsData = (agent: AgentPerformance) => {
  return Array(12)
    .fill(0)
    .map((_, i) => ({
      value: Math.floor(Math.random() * (agent.totalCalls / 10)) + 20,
    }))
}

const generateAgentHangupData = (agent: AgentPerformance) => [
  { day: "Mon", value: Math.floor(Math.random() * 8) + 1 },
  { day: "Tue", value: Math.floor(Math.random() * 8) + 1 },
  { day: "Wed", value: Math.floor(Math.random() * 8) + 1 },
  { day: "Thu", value: Math.floor(Math.random() * 8) + 1 },
  { day: "Fri", value: Math.floor(Math.random() * 8) + 1 },
  { day: "Sat", value: Math.floor(Math.random() * 8) + 1 },
  { day: "Sun", value: Math.floor(Math.random() * 8) + 1 },
]

const sentimentData = [
  { name: "Happy", value: 30, color: "#000000" },
  { name: "Satisfied", value: 25, color: "#ffab00" },
  { name: "Not Satisfied", value: 20, color: "#e76e50" },
  { name: "Neutral", value: 10, color: "#22c55e" },
  { name: "Sad", value: 15, color: "#a855f7" },
]

export function AgentDetailsDialog({ agent, open, onOpenChange }: AgentDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (open && agent) {
      // Initial render
      const initialTimer = setTimeout(() => {
        window.dispatchEvent(new Event("resize"))
        setIsInitialized(true)
      }, 100)

      // Secondary render to ensure charts are properly sized
      const secondaryTimer = setTimeout(() => {
        window.dispatchEvent(new Event("resize"))
      }, 200)

      return () => {
        clearTimeout(initialTimer)
        clearTimeout(secondaryTimer)
        setIsInitialized(false)
      }
    }
  }, [open, agent])

  if (!agent) return null

  const metricsData = generateAgentMetricsData(agent)
  const hangupData = generateAgentHangupData(agent)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="sticky top-0 z-50 bg-background px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {agent.isAI ? (
                <div className="flex items-center justify-center size-8 aspect-square rounded-full bg-gradient-to-br from-[#22c55e]/20 to-[#22c55e]/10">
                  <Bot className="h-4 w-4 text-[#15803d]" />
                </div>
              ) : (
                <div className="flex items-center justify-center size-8 aspect-square rounded-full bg-[#52525b]/10">
                  <User className="h-4 w-4 text-[#52525b]" />
                </div>
              )}
              {agent.name}
            </DialogTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          {(isInitialized || !open) && (
            <Tabs
              defaultValue="overview"
              className="w-full"
              onValueChange={(value) => {
                setActiveTab(value)
                setSelectedStep(null)
              }}
            >
              <div className="px-6 pt-4">
                <TabsList className="justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="coaching">Coaching Opportunities</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="px-6 py-4 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm font-normal text-muted-foreground">Conversion Rate</CardTitle>
                      <div className="text-2xl font-bold">
                        {Math.round((agent.callsBooked / agent.bookableCalls) * 100)}%
                      </div>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm font-normal text-muted-foreground">Avg Call Time</CardTitle>
                      <div className="text-2xl font-bold">{agent.avgTimeOnCall}</div>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm font-normal text-muted-foreground">Response Time</CardTitle>
                      <div className="text-2xl font-bold">{agent.timeToAnswer}</div>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm font-normal text-muted-foreground">Avg Playbook Score</CardTitle>
                      <div className="text-2xl font-bold">
                        <Badge variant="secondary" className="bg-[#22c55e]/10 text-[#22c55e]">
                          {agent.avgPlaybookScore}%
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                </div>

                {/* Top Requests and Unbooked Reasons */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm">Common Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-2">
                        <RequestItem label="Water heater repair" count={2} />
                        <RequestItem label="Scheduling" count={2} />
                        <RequestItem label="Emergency plumbing" count={8} />
                        <RequestItem label="Price inquiry" count={11} />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm">Lost Reasons</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-2">
                        <RequestItem label="Price too high" count={2} />
                        <RequestItem label="Service area" count={2} />
                        <RequestItem label="Availability" count={8} />
                        <RequestItem label="Competition" count={11} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Objections */}
                <Card className="p-4">
                  <CardContent className="px-0 pb-0">
                    <TopObjectionsChart />
                  </CardContent>
                </Card>

                {/* Hangup Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4">
                    <HangupMetricsChart
                      title="Pricing Hangups"
                      total={Math.floor(agent.totalCalls * 0.1)}
                      change={25}
                      data={hangupData}
                    />
                  </Card>
                  <Card className="p-4">
                    <HangupMetricsChart
                      title="Schedule Hangups"
                      total={Math.floor(agent.totalCalls * 0.05)}
                      change={25}
                      data={hangupData}
                    />
                  </Card>
                  <Card className="p-4">
                    <HangupMetricsChart
                      title="Initial Hangups"
                      total={Math.floor(agent.totalCalls * 0.08)}
                      change={25}
                      data={hangupData}
                    />
                  </Card>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <Card className="p-4">
                    <HangupMetricsChart
                      title="Customer Sentiment"
                      total={85}
                      change={5}
                      data={generateAgentHangupData(agent)}
                    />
                  </Card>
                  <Card className="p-4">
                    <HangupMetricsChart
                      title="Membership Offers"
                      total={78}
                      change={-2}
                      data={generateAgentHangupData(agent)}
                    />
                  </Card>
                  <Card className="p-4">
                    <HangupMetricsChart
                      title="Positive Tone"
                      total={92}
                      change={3}
                      data={generateAgentHangupData(agent)}
                      isPercentage={true}
                    />
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="coaching" className="px-6 py-4 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    {!selectedStep ? (
                      <CoachingOpportunities onSelectOpportunity={setSelectedStep} />
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setSelectedStep(null)}>
                            ← Back to opportunities
                          </Button>
                        </div>
                        <CallsTable playbookStep={selectedStep} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function RequestItem({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center">
      <div className="flex-1 text-sm">{label}</div>
      <Badge variant="secondary" className="ml-auto">
        {count}
      </Badge>
    </div>
  )
}

