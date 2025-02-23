"use client"

import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import { ChartTooltip } from "./chart-tooltip"

interface HangupMetricsChartProps {
  title: string
  total: number
  change: number
  data: Array<{
    day: string
    value: number
  }>
  isPercentage?: boolean
}

export function HangupMetricsChart({ title, total, change, data, isPercentage = false }: HangupMetricsChartProps) {
  const chartHeight = 200

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-normal text-muted-foreground">{isPercentage ? "Agent Tone" : title}</h3>
        <Badge
          variant="secondary"
          className={`${
            change >= 0 ? "bg-[#22c55e]/10 text-[#22c55e]" : "bg-[#ef4444]/10 text-[#ef4444]"
          } hover:bg-[#22c55e]/20`}
        >
          {change >= 0 ? "+" : ""}
          {change}%
        </Badge>
      </div>
      <div className="text-2xl font-bold">
        {isPercentage ? (total >= 75 ? "Good" : total >= 50 ? "Fair" : "Poor") : total}
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} tickMargin={8} />
            <Tooltip
              content={({ active, payload, label }) => (
                <ChartTooltip
                  active={active}
                  payload={payload}
                  label={label}
                  formatter={(value) => (isPercentage ? `${value}%` : value.toString())}
                />
              )}
            />
            <Bar dataKey="value" fill="#18181b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

