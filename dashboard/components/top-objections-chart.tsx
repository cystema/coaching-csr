"use client"
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  {
    day: "Mon",
    "Scheduling Conflicts": 10,
    "Customer Needs Time to Decide": 8,
    "Immediate Service Unavailability": 6,
    "Service Fee Concerns": 5,
    "Approximate Pricing Requests": 4,
    "Phone Connection Issues": 3,
    "Service Affordability Concerns": 3,
    "In-Person Estimates Only": 2,
    Other: 1,
  },
  {
    day: "Tue",
    "Scheduling Conflicts": 12,
    "Customer Needs Time to Decide": 9,
    "Immediate Service Unavailability": 7,
    "Service Fee Concerns": 6,
    "Approximate Pricing Requests": 5,
    "Phone Connection Issues": 4,
    "Service Affordability Concerns": 3,
    "In-Person Estimates Only": 2,
    Other: 2,
  },
  {
    day: "Wed",
    "Scheduling Conflicts": 11,
    "Customer Needs Time to Decide": 7,
    "Immediate Service Unavailability": 8,
    "Service Fee Concerns": 4,
    "Approximate Pricing Requests": 6,
    "Phone Connection Issues": 2,
    "Service Affordability Concerns": 4,
    "In-Person Estimates Only": 3,
    Other: 1,
  },
  {
    day: "Thu",
    "Scheduling Conflicts": 9,
    "Customer Needs Time to Decide": 10,
    "Immediate Service Unavailability": 5,
    "Service Fee Concerns": 7,
    "Approximate Pricing Requests": 3,
    "Phone Connection Issues": 5,
    "Service Affordability Concerns": 2,
    "In-Person Estimates Only": 1,
    Other: 3,
  },
  {
    day: "Fri",
    "Scheduling Conflicts": 13,
    "Customer Needs Time to Decide": 6,
    "Immediate Service Unavailability": 9,
    "Service Fee Concerns": 5,
    "Approximate Pricing Requests": 4,
    "Phone Connection Issues": 3,
    "Service Affordability Concerns": 5,
    "In-Person Estimates Only": 2,
    Other: 1,
  },
  {
    day: "Sat",
    "Scheduling Conflicts": 8,
    "Customer Needs Time to Decide": 5,
    "Immediate Service Unavailability": 4,
    "Service Fee Concerns": 3,
    "Approximate Pricing Requests": 2,
    "Phone Connection Issues": 1,
    "Service Affordability Concerns": 2,
    "In-Person Estimates Only": 1,
    Other: 1,
  },
  {
    day: "Sun",
    "Scheduling Conflicts": 7,
    "Customer Needs Time to Decide": 4,
    "Immediate Service Unavailability": 3,
    "Service Fee Concerns": 2,
    "Approximate Pricing Requests": 1,
    "Phone Connection Issues": 1,
    "Service Affordability Concerns": 1,
    "In-Person Estimates Only": 1,
    Other: 1,
  },
]

const colors = [
  "#000000",
  "#333333",
  "#666666",
  "#999999",
  "#cccccc",
  "#1a1a1a",
  "#4d4d4d",
  "#808080",
  "#b3b3b3",
  "#e6e6e6",
]

export function TopObjectionsChart() {
  const totalObjections = data.reduce(
    (acc, day) =>
      acc + Object.entries(day).reduce((sum, [key, value]) => (key !== "day" ? sum + (value as number) : sum), 0),
    0,
  )

  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-base font-normal text-muted-foreground">Top Objections</h3>
        <div className="text-2xl font-bold">{totalObjections}</div>
        <div className="text-sm text-muted-foreground">Total objections</div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null

                return (
                  <div className="bg-white p-2 border border-gray-200 rounded shadow-md">
                    <p className="font-bold">{label}</p>
                    {payload.map((entry, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{entry.name}: </span>
                        <span className="font-semibold">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
            {Object.keys(data[0])
              .filter((key) => key !== "day")
              .map((key, index) => (
                <Bar key={key} dataKey={key} stackId="a" fill={colors[index % colors.length]} />
              ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

