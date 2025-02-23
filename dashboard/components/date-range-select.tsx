"use client"
import { addDays, addMonths, addYears, startOfMonth } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type DateRangePreset = {
  from: Date
  to: Date
}

type DateRangeOption = {
  label: string
  value: string
  getData: () => DateRangePreset
}

const dateRangeOptions: DateRangeOption[] = [
  {
    label: "Last 7 days",
    value: "7d",
    getData: () => ({
      from: addDays(new Date(), -7),
      to: new Date(),
    }),
  },
  {
    label: "Month to date",
    value: "mtd",
    getData: () => ({
      from: startOfMonth(new Date()),
      to: new Date(),
    }),
  },
  {
    label: "Last month",
    value: "1m",
    getData: () => ({
      from: addMonths(new Date(), -1),
      to: new Date(),
    }),
  },
  {
    label: "Last 3 months",
    value: "3m",
    getData: () => ({
      from: addMonths(new Date(), -3),
      to: new Date(),
    }),
  },
  {
    label: "Last 6 months",
    value: "6m",
    getData: () => ({
      from: addMonths(new Date(), -6),
      to: new Date(),
    }),
  },
  {
    label: "Last year",
    value: "1y",
    getData: () => ({
      from: addYears(new Date(), -1),
      to: new Date(),
    }),
  },
]

interface DateRangeSelectProps {
  onSelect?: (range: DateRangePreset) => void
}

export function DateRangeSelect({ onSelect }: DateRangeSelectProps) {
  const handleSelect = (value: string) => {
    const option = dateRangeOptions.find((opt) => opt.value === value)
    if (option && onSelect) {
      onSelect(option.getData())
    }
  }

  return (
    <Select onValueChange={handleSelect} defaultValue="7d">
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select range" />
      </SelectTrigger>
      <SelectContent>
        {dateRangeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

