"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreVertical, Volume2, Plus } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { name: "7 days", value: 40 },
  { name: "6 days", value: 45 },
  { name: "5 days", value: 50 },
  { name: "4 days", value: 55 },
  { name: "3 days", value: 60 },
  { name: "2 days", value: 65 },
  { name: "Today", value: 70 },
]

const negativeData = [
  { name: "7 days", value: 60 },
  { name: "6 days", value: 58 },
  { name: "5 days", value: 55 },
  { name: "4 days", value: 52 },
  { name: "3 days", value: 50 },
  { name: "2 days", value: 48 },
  { name: "Today", value: 45 },
]

interface AgentCardProps {
  name: string
  location: string
  status: "Active" | "Paused"
  issues: number
  change: number
  avatar: string
  trend: "up" | "down"
}

function AgentCard({ name, location, status, issues, change, avatar, trend }: AgentCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${status === "Active" ? "bg-green-500" : "bg-yellow-500"}`} />
          <span>Agent 2 {status}</span>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground flex items-center">
              {location}
              <Volume2 className="h-4 w-4 ml-1" />
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Issues Resolved</p>
            <div className="flex items-baseline space-x-3">
              <h2 className="text-3xl font-bold">{issues}</h2>
              <span className={`text-sm ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {trend === "up" ? "↑" : "↓"} {Math.abs(change)}%
              </span>
            </div>
          </div>

          <div className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend === "up" ? data : negativeData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={trend === "up" ? "#22c55e" : "#ef4444"}
                  strokeWidth={2}
                  dot={false}
                />
                <XAxis dataKey="name" hide />
                <YAxis hide />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>7 days</span>
            <span>Today</span>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
              <div>
                <h4 className="font-semibold">Customer service</h4>
                <p className="text-sm text-muted-foreground">8 integrations</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AgentPerformance() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Service Agents</h1>
          <p className="text-muted-foreground">801-555-9012</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
            Community Agents
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Agent
          </Button>
        </div>
      </div>

      <Tabs defaultValue="customer-service" className="w-full">
        <TabsList>
          <TabsTrigger value="reception">Reception</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="customer-service">Customer Service</TabsTrigger>
          <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AgentCard
          name="Autumn"
          location="East-coast female"
          status="Active"
          issues={125}
          change={65}
          avatar="/placeholder.svg?height=100&width=100"
          trend="up"
        />
        <AgentCard
          name="Anthony"
          location="So-cal male"
          status="Paused"
          issues={88}
          change={8}
          avatar="/placeholder.svg?height=100&width=100"
          trend="up"
        />
        <AgentCard
          name="Rodger"
          location="So-cal male"
          status="Active"
          issues={76}
          change={8}
          avatar="/placeholder.svg?height=100&width=100"
          trend="down"
        />
        <Card className="flex items-center justify-center p-6">
          <div className="text-center">
            <Button size="lg" variant="outline" className="rounded-full h-12 w-12 mb-4">
              <Plus className="h-6 w-6" />
            </Button>
            <h3 className="font-semibold">Add Agent</h3>
            <p className="text-sm text-muted-foreground">Add additional Agents to compare results</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

