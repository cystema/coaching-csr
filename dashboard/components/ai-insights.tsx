"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles, ArrowUpRight, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AIInsights() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [insights, setInsights] = React.useState<string[]>([
    "Revenue peaked in February at $85,000, showing a 30.7% increase from January",
    "There's a strong correlation between total conversations and booked appointments",
    "Customer engagement is highest during mid-week, suggesting optimal times for marketing campaigns",
  ])

  const refreshInsights = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setInsights([
        "March showed a 47% decrease in revenue, indicating a potential seasonal trend",
        "Conversion rate from bookable to booked conversations is maintaining at 83%",
        "Emergency calls have decreased by 5%, suggesting improved preventive maintenance",
      ])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <Card className="border-none bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-gray-300" />
            <CardTitle className="text-white">AI Insights</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshInsights}
            disabled={isLoading}
            className="hover:bg-gray-600/20 text-gray-300"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3"
          >
            <Lightbulb className="h-5 w-5 text-gray-300 mt-0.5" />
            <p className="text-sm text-gray-200">{insight}</p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}

