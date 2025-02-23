"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, User } from "lucide-react"
import { useState } from "react"
import { AgentDetailsDialog } from "./agent-details-dialog"

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

const agentData: AgentPerformance[] = [
  {
    id: "1",
    name: "AI Assistant Pro",
    isAI: true,
    totalCalls: 450,
    bookableCalls: 380,
    callsBooked: 285,
    avgTimeOnCall: "2m 15s",
    timeToAnswer: "< 1s",
    topLostReason: "Price too high",
    topWinReason: "Immediate availability",
    avgPlaybookScore: 95,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    isAI: false,
    totalCalls: 380,
    bookableCalls: 320,
    callsBooked: 256,
    avgTimeOnCall: "3m 45s",
    timeToAnswer: "15s",
    topLostReason: "Service area",
    topWinReason: "Personalized solution",
    avgPlaybookScore: 92,
  },
  {
    id: "3",
    name: "AI Support Elite",
    isAI: true,
    totalCalls: 425,
    bookableCalls: 360,
    callsBooked: 270,
    avgTimeOnCall: "2m 30s",
    timeToAnswer: "< 1s",
    topLostReason: "Schedule conflict",
    topWinReason: "Quick resolution",
    avgPlaybookScore: 94,
  },
  {
    id: "4",
    name: "Michael Chen",
    isAI: false,
    totalCalls: 350,
    bookableCalls: 295,
    callsBooked: 236,
    avgTimeOnCall: "4m 10s",
    timeToAnswer: "20s",
    topLostReason: "Budget constraints",
    topWinReason: "Technical expertise",
    avgPlaybookScore: 89,
  },
  {
    id: "5",
    name: "AI Scheduler Plus",
    isAI: true,
    totalCalls: 400,
    bookableCalls: 340,
    callsBooked: 255,
    avgTimeOnCall: "2m 45s",
    timeToAnswer: "< 1s",
    topLostReason: "Service type",
    topWinReason: "24/7 availability",
    avgPlaybookScore: 93,
  },
]

export function AgentsPerformanceTable() {
  const [selectedAgent, setSelectedAgent] = useState<AgentPerformance | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleRowClick = (agent: AgentPerformance) => {
    setSelectedAgent(agent)
    setDialogOpen(true)
  }

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-normal">Top Performing Agents</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[60px]">Rank</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead className="text-right">Total Calls</TableHead>
                <TableHead className="text-right">Bookable Calls</TableHead>
                <TableHead className="text-right">Calls Booked</TableHead>
                <TableHead className="text-right">Avg Time on Call</TableHead>
                <TableHead className="text-right">Time to Answer</TableHead>
                <TableHead>Top Lost Reason</TableHead>
                <TableHead>Top Win Reason</TableHead>
                <TableHead className="text-right">Avg Playbook Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agentData.map((agent, index) => (
                <TableRow
                  key={agent.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(agent)}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {agent.isAI ? (
                        <div className="flex items-center justify-center size-8 aspect-square rounded-full bg-[#22c55e]/10">
                          <Bot className="h-4 w-4 text-[#22c55e]" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center size-8 aspect-square rounded-full bg-[#52525b]/10">
                          <User className="h-4 w-4 text-[#52525b]" />
                        </div>
                      )}
                      {agent.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{agent.totalCalls}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {agent.bookableCalls}
                      <Badge variant="secondary" className="bg-[#18181b]/10 text-[#18181b]">
                        {Math.round((agent.bookableCalls / agent.totalCalls) * 100)}%
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {agent.callsBooked}
                      <Badge
                        variant="secondary"
                        className={`${
                          Math.round((agent.callsBooked / agent.bookableCalls) * 100) >= 80
                            ? "bg-green-100 text-green-800"
                            : Math.round((agent.callsBooked / agent.bookableCalls) * 100) >= 75
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {Math.round((agent.callsBooked / agent.bookableCalls) * 100)}%
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{agent.avgTimeOnCall}</TableCell>
                  <TableCell className="text-right">{agent.timeToAnswer}</TableCell>
                  <TableCell>{agent.topLostReason}</TableCell>
                  <TableCell>{agent.topWinReason}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="bg-[#22c55e]/10 text-[#22c55e]">
                      {agent.avgPlaybookScore}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AgentDetailsDialog agent={selectedAgent} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}

