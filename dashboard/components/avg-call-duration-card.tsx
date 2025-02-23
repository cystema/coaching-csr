import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { ChartTooltip } from "./chart-tooltip"

// Sample data for the last 7 days
const durationData = [
  { date: "Mon", avgDuration: 154 }, // 2m 34s
  { date: "Tue", avgDuration: 180 }, // 3m
  { date: "Wed", avgDuration: 165 }, // 2m 45s
  { date: "Thu", avgDuration: 145 }, // 2m 25s
  { date: "Fri", avgDuration: 170 }, // 2m 50s
  { date: "Sat", avgDuration: 150 }, // 2m 30s
  { date: "Sun", avgDuration: 160 }, // 2m 40s
]

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

export function AvgCallDurationCard() {
  // Calculate the overall average
  const overallAverage = Math.round(durationData.reduce((sum, item) => sum + item.avgDuration, 0) / durationData.length)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal text-muted-foreground">Avg. Call Duration</CardTitle>
        <Badge variant="secondary" className="bg-[#dc2626]/10 text-[#dc2626] hover:bg-[#dc2626]/20">
          -5%
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatDuration(overallAverage)}</div>
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={durationData} margin={{ left: -20 }}>
              <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} tickFormatter={(value) => `${Math.floor(value / 60)}m`} />
              <Tooltip
                content={({ active, payload, label }) => (
                  <ChartTooltip
                    active={active}
                    payload={payload}
                    label={label}
                    formatter={(value) => formatDuration(value as number)}
                  />
                )}
              />
              <Bar dataKey="avgDuration" fill="#18181b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

