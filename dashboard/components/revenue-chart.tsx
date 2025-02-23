import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import { ChartTooltip } from "./chart-tooltip"

interface RevenueChartProps {
  data: { month: string; value: number }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal text-muted-foreground">Revenue</CardTitle>
        <Badge variant="secondary" className="bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20">
          +25%
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$280,000</div>
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <Tooltip
                content={({ active, payload, label }) => (
                  <ChartTooltip
                    active={active}
                    payload={payload}
                    label={label}
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                )}
              />
              <Bar dataKey="value" fill="#18181b" radius={[4, 4, 0, 0]} activeBar={{ fill: "#18181b" }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

