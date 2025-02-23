import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts"
import { DateFilter } from "@/components/date-filter"
import { AIInsights } from "@/components/ai-insights"
import type { DateRange } from "react-day-picker"
import React from "react"
import { PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts"
import { InfoIcon as InfoCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AvgCallDurationCard } from "@/components/avg-call-duration-card"
import { RevenueChart } from "@/components/revenue-chart"
import { MetricCard } from "@/components/metric-card"
import { HangupTimelineChart } from "@/components/hangup-timeline-chart"
import { HangupMetricsChart } from "@/components/hangup-metrics-chart"
import { AgentsPerformanceTable } from "@/components/agents-performance-table"
import { PlaybookScoreChart } from "@/components/playbook-score-chart"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ThumbsUp } from "lucide-react"

const revenueData = [
  { month: "Jan", value: 65000 },
  { month: "Feb", value: 85000 },
  { month: "Mar", value: 45000 },
  { month: "Apr", value: 65000 },
  { month: "May", value: 45000 },
  { month: "Jun", value: 55000 },
]

const weeklyMinutes = [
  { day: "Mon", minutes: 600 },
  { day: "Tue", minutes: 1200 },
  { day: "Wed", minutes: 800 },
  { day: "Thu", minutes: 900 },
  { day: "Fri", minutes: 600 },
  { day: "Sat", minutes: 750 },
  { day: "Sun", minutes: 700 },
]

const sentimentData = [
  { name: "Happy", value: 30, color: "#000000" },
  { name: "Satisfied", value: 25, color: "#ffab00" },
  { name: "Not Satisfied", value: 20, color: "#e76e50" },
  { name: "Neutral", value: 10, color: "#22c55e" },
  { name: "Sad", value: 15, color: "#a855f7" },
]

const callStatusData = [
  { name: "Completed", value: 275, color: "#000000" },
  { name: "Abandoned", value: 90, color: "#a855f7" },
  { name: "Missed", value: 173, color: "#ffab00" },
  { name: "Failed", value: 187, color: "#e76e50" },
  { name: "Transferred", value: 200, color: "#22c55e" },
]

const callVolumeData = [
  { subject: "12am - 5am", value: 120 },
  { subject: "5am - 8am", value: 280 },
  { subject: "8am - 12pm", value: 200 },
  { subject: "12pm - 5pm", value: 180 },
  { subject: "5pm - 9pm", value: 160 },
  { subject: "9pm - 12am", value: 140 },
]

const escalatedCallsData = [
  { day: "Mon", calls: 28 },
  { day: "Tue", calls: 45 },
  { day: "Wed", calls: 35 },
  { day: "Thu", calls: 40 },
  { day: "Fri", calls: 30 },
  { day: "Sat", calls: 35 },
  { day: "Sun", calls: 32 },
]

const sparklineData = Array(12)
  .fill(0)
  .map((_, i) => ({
    value: Math.random() * 100,
  }))

const unbookedCalls = 48

export default function DashboardPage() {
  const [dateRange, setDateRange] = React.useState<DateRange>()

  return (
    <div className="flex-1 p-8 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
      <Tabs defaultValue="overview" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">Agent Performance</TabsTrigger>
            <TabsTrigger value="call-analytics">Call Analytics</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Select defaultValue="wightons">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select business" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wightons">Wighton's Plumbing</SelectItem>
              </SelectContent>
            </Select>
            <DateFilter onSelect={setDateRange} />
          </div>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <RevenueChart data={revenueData} />
          <Alert
            variant="default"
            className={`mt-4 ${
              unbookedCalls === 0
                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30"
                : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/30"
            } shadow-sm`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {unbookedCalls === 0 ? (
                  <ThumbsUp className="h-4 w-4 text-green-500 dark:text-green-400" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                )}
                <AlertDescription
                  className={`text-sm font-medium ${
                    unbookedCalls === 0 ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                  }`}
                >
                  Qualified, unbooked calls
                </AlertDescription>
              </div>
              <span
                className={`text-sm font-medium ${
                  unbookedCalls === 0 ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                }`}
              >
                {unbookedCalls}
              </span>
            </div>
          </Alert>
          <AIInsights />
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="Total Conversations"
              value="350"
              change={25}
              data={sparklineData}
              formatter={(value) => value.toFixed(0)}
            />
            <MetricCard
              title="Bookable Conversations"
              value="300"
              change={-5}
              data={sparklineData}
              formatter={(value) => value.toFixed(0)}
            />
            <MetricCard
              title="Booked Conversations"
              value="250"
              change={25}
              data={sparklineData}
              formatter={(value) => value.toFixed(0)}
            />
            <MetricCard
              title="Support calls handled"
              value="29"
              change={25}
              data={sparklineData}
              formatter={(value) => value.toFixed(0)}
            />
            <MetricCard
              title="Emergencies handled"
              value="15"
              change={-5}
              data={sparklineData}
              formatter={(value) => value.toFixed(0)}
            />
            <MetricCard
              title="Spam calls"
              value="8"
              change={25}
              data={sparklineData}
              formatter={(value) => value.toFixed(0)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <RequestItem label="Water heater is broken" count={2} />
                  <RequestItem label="When tech arrives?" count={2} />
                  <RequestItem label="Pipe broken" count={8} />
                  <RequestItem label="Speak to a person" count={11} />
                  <RequestItem label="Cancel appointment" count={2} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top unbooked reasons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <RequestItem label="Timing issue" count={2} />
                  <RequestItem label="Agent Requested" count={2} />
                  <RequestItem label="Dispatch Fee Issue" count={8} />
                  <RequestItem label="Wanted Pricing" count={11} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="agents" className="space-y-4">
          <PlaybookScoreChart />
          <div className="grid gap-4">
            <AgentsPerformanceTable />
          </div>
        </TabsContent>
        <TabsContent value="call-analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal text-muted-foreground">Total Minutes</CardTitle>
                <Badge variant="secondary" className="bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20">
                  +25%
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5,452</div>
                <div className="h-[200px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyMinutes}>
                      <XAxis dataKey="day" />
                      <Bar dataKey="minutes" fill="#18181b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <AvgCallDurationCard />

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-base font-normal text-muted-foreground">Customer Sentiment</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>Based on call analysis and feedback</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-4">Good</div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sentimentData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal text-muted-foreground">Call breakdown by status</CardTitle>
                <Badge variant="secondary" className="bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20">
                  +25%
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={callStatusData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                        {callStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-normal text-muted-foreground">Call volume spikes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold mb-2">Highest: 5-8am</div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={callVolumeData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <Radar name="Volume" dataKey="value" stroke="#18181b" fill="#18181b" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal text-muted-foreground">
                  Calls escalated to a person
                </CardTitle>
                <Badge variant="secondary" className="bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20">
                  +25%
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-4">250</div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={escalatedCallsData}>
                      <XAxis dataKey="day" />
                      <Bar dataKey="calls" fill="#18181b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <HangupTimelineChart />
          <div className="grid gap-4 md:grid-cols-3">
            <HangupMetricsChart
              title="Hang up over pricing"
              total={34}
              change={25}
              data={[
                { day: "Mon", value: 3 },
                { day: "Tue", value: 8 },
                { day: "Wed", value: 4 },
                { day: "Thu", value: 5 },
                { day: "Fri", value: 3 },
                { day: "Sat", value: 4 },
                { day: "Sun", value: 4 },
              ]}
            />
            <HangupMetricsChart
              title="Hang up over scheduling"
              total={22}
              change={25}
              data={[
                { day: "Mon", value: 2 },
                { day: "Tue", value: 8 },
                { day: "Wed", value: 4 },
                { day: "Thu", value: 5 },
                { day: "Fri", value: 3 },
                { day: "Sat", value: 4 },
                { day: "Sun", value: 4 },
              ]}
            />
            <HangupMetricsChart
              title="Hang up at start"
              total={22}
              change={25}
              data={[
                { day: "Mon", value: 2 },
                { day: "Tue", value: 8 },
                { day: "Wed", value: 4 },
                { day: "Thu", value: 5 },
                { day: "Fri", value: 3 },
                { day: "Sat", value: 4 },
                { day: "Sun", value: 4 },
              ]}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RequestItem({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center">
      <div className="flex-1 text-sm">{label}</div>
      <Badge variant="secondary" className="ml-auto">
        {count}
      </Badge>
    </div>
  )
}

