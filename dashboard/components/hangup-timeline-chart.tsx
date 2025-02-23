"use client"
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import { ChartTooltip } from "./chart-tooltip"

const data = [
  {
    day: "M",
    "0-15s": 2,
    "15-30s": 3,
    "30-60s": 1,
    "60-90s": 1,
  },
  {
    day: "T",
    "0-15s": 4,
    "15-30s": 3,
    "30-60s": 2,
    "60-90s": 2,
  },
  {
    day: "W",
    "0-15s": 3,
    "15-30s": 2,
    "30-60s": 2,
    "60-90s": 1,
  },
  {
    day: "Th",
    "0-15s": 3,
    "15-30s": 2,
    "30-60s": 2,
    "60-90s": 2,
  },
  {
    day: "F",
    "0-15s": 2,
    "15-30s": 2,
    "30-60s": 1,
    "60-90s": 1,
  },
  {
    day: "S",
    "0-15s": 3,
    "15-30s": 3,
    "30-60s": 2,
    "60-90s": 1,
  },
]

export function HangupTimelineChart() {
  const totalHangups = data.reduce((acc, day) => acc + day["0-15s"] + day["15-30s"] + day["30-60s"] + day["60-90s"], 0)

  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-base font-normal text-muted-foreground">Hang up before 15, 30, 60, 90 seconds</h3>
        <div className="text-2xl font-bold">{totalHangups}</div>
        <div className="text-sm text-muted-foreground">Total hangups</div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null

                return (
                  <ChartTooltip
                    active={active}
                    payload={payload}
                    label={label}
                    formatter={(value, name) => [`${value} hangups`, name as string]}
                  />
                )
              }}
            />
            <Bar dataKey="0-15s" stackId="a" fill="#18181b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="15-30s" stackId="a" fill="#a855f7" />
            <Bar dataKey="30-60s" stackId="a" fill="#f97316" />
            <Bar dataKey="60-90s" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

