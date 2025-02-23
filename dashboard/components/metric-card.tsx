import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts"
import { cn } from "@/lib/utils"
import { ChartTooltip } from "./chart-tooltip"

interface MetricCardProps {
  title: string
  value: string
  change: number
  data: { value: number }[]
  formatter?: (value: number) => string
}

export function MetricCard({ title, value, change, data, formatter }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal text-muted-foreground">{title}</CardTitle>
        <Badge
          variant="secondary"
          className={cn(
            change > 0
              ? "bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20"
              : "bg-[#dc2626]/10 text-[#dc2626] hover:bg-[#dc2626]/20",
          )}
        >
          {change > 0 ? "+" : ""}
          {change}%
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="h-[80px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <Tooltip
                content={({ active, payload, label }) => (
                  <ChartTooltip active={active} payload={payload} label={label} formatter={formatter} />
                )}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={change > 0 ? "#22c55e" : "#dc2626"}
                fill={change > 0 ? "#22c55e20" : "#dc262620"}
                dot={false}
                activeDot={{ r: 4, fill: change > 0 ? "#22c55e" : "#dc2626" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

