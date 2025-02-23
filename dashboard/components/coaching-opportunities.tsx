"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CoachingOpportunity {
  step: string
  section: "GREETING" | "CALL FLOW ACCURACY" | "TECHNICAL ACCURACY"
  missRate: number
  missed: number
  total: number
}

const coachingData: CoachingOpportunity[] = [
  {
    step: "Use warm, friendly tone",
    section: "GREETING",
    missRate: 17,
    missed: 330,
    total: 1948,
  },
  {
    step: "New membership offer",
    section: "CALL FLOW ACCURACY",
    missRate: 15,
    missed: 287,
    total: 1948,
  },
  {
    step: "Job Type selection",
    section: "TECHNICAL ACCURACY",
    missRate: 13,
    missed: 252,
    total: 1948,
  },
  {
    step: "Add Job Summary notes",
    section: "TECHNICAL ACCURACY",
    missRate: 8,
    missed: 157,
    total: 1948,
  },
  {
    step: "Hold procedure compliance",
    section: "CALL FLOW ACCURACY",
    missRate: 7,
    missed: 143,
    total: 1948,
  },
]

export function CoachingOpportunities({ onSelectOpportunity }: { onSelectOpportunity: (step: string) => void }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Playbook step</TableHead>
          <TableHead>Section</TableHead>
          <TableHead className="text-right">Miss rate</TableHead>
          <TableHead className="text-right"># Missed/Total calls</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coachingData.map((opportunity) => (
          <TableRow
            key={opportunity.step}
            className="cursor-pointer"
            onClick={() => onSelectOpportunity(opportunity.step)}
          >
            <TableCell>{opportunity.step}</TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-800 hover:bg-slate-100 hover:text-slate-800"
              >
                {opportunity.section}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{opportunity.missRate}%</TableCell>
            <TableCell className="text-right">
              {opportunity.missed}/{opportunity.total}
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

