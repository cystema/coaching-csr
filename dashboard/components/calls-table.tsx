"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { Play, Pause } from "lucide-react"
import { useState } from "react"

interface Call {
  id: string
  date: string
  time: string
  duration: string
  outcome: "Booked" | "Not Booked"
  customer: string
  notes: string
}

const generateCalls = (count: number): Call[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `CALL-${Math.floor(Math.random() * 10000)}`,
    date: "2025-02-05",
    time: `${Math.floor(Math.random() * 12 + 1)}:${Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, "0")} PM`,
    duration: `${Math.floor(Math.random() * 10 + 1)}m ${Math.floor(Math.random() * 60)}s`,
    outcome: Math.random() > 0.5 ? "Booked" : "Not Booked",
    customer: `Customer ${i + 1}`,
    notes: "Customer requested more information about pricing and availability.",
  }))
}

export function CallsTable({ playbookStep }: { playbookStep: string }) {
  const calls = generateCalls(10)
  const [playingCall, setPlayingCall] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Calls Missing: {playbookStep}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Call ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Outcome</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Recording</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => (
            <TableRow key={call.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <span>{call.id}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(call.id)}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy call ID</span>
                  </Button>
                </div>
              </TableCell>
              <TableCell>{call.date}</TableCell>
              <TableCell>{call.time}</TableCell>
              <TableCell>{call.duration}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={call.outcome === "Booked" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {call.outcome}
                </Badge>
              </TableCell>
              <TableCell>{call.customer}</TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{call.notes}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPlayingCall(playingCall === call.id ? null : call.id)}
                >
                  {playingCall === call.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span className="sr-only">{playingCall === call.id ? "Pause" : "Play"} call recording</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

