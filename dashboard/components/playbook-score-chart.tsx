"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { ChartTooltip } from "./chart-tooltip"

const data = [
  { date: "Jan 1", score: 82 },
  { date: "Jan 8", score: 85 },
  { date: "Jan 15", score: 86 },
  { date: "Jan 22", score: 89 },
  { date: "Jan 29", score: 88 },
  { date: "Feb 5", score: 89 },
  { date: "Feb 12", score: 91 },
  { date: "Feb 19", score: 90 },
  { date: "Feb 26", score: 92 },
  { date: "Mar 4", score: 93 },
  { date: "Mar 11", score: 94 },
  { date: "Mar 18", score: 95 },
]

export function PlaybookScoreChart() {
  const currentScore = data[data.length - 1].score
  const previousScore = data[data.length - 2].score
  const improvement = currentScore - previousScore

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-normal text-muted-foreground">Team Playbook Score Accuracy</CardTitle>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold">{currentScore}%</div>
            <Badge variant="secondary" className="bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20">
              +{improvement}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} tickMargin={8} stroke="#71717a" />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickMargin={8}
                domain={[60, 100]}
                ticks={[60, 70, 80, 90, 100]}
                tickFormatter={(value) => `${value}%`}
                stroke="#71717a"
              />
              <Tooltip
                content={({ active, payload, label }) => (
                  <ChartTooltip active={active} payload={payload} label={label} formatter={(value) => `${value}%`} />
                )}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#18181b"
                strokeWidth={1.5}
                dot={false}
                activeDot={{
                  r: 4,
                  style: { fill: "#18181b" },
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

