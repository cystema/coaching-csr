import { Card, CardContent } from "@/components/ui/card"

interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  formatter?: (value: number) => string
}

export function ChartTooltip({ active, payload, label, formatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <Card className="border-none shadow-lg">
      <CardContent className="p-3">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">
          {formatter ? formatter(payload[0].value) : `${payload[0].value.toLocaleString()}`}
        </div>
      </CardContent>
    </Card>
  )
}

