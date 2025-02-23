"use client"

import * as React from "react"
import { addDays, addMonths, addYears, format, startOfMonth } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type DateRangePreset = {
  from: Date
  to: Date
}

type DateOption = {
  label: string
  value: string
  getData: () => DateRangePreset
}

const dateOptions: DateOption[] = [
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

interface DateFilterProps {
  onSelect?: (date: DateRange) => void
}

export function DateFilter({ onSelect }: DateFilterProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedRange, setSelectedRange] = React.useState<DateRange | undefined>()
  const [showCalendar, setShowCalendar] = React.useState(false)

  const handleSelect = React.useCallback(
    (option: DateOption) => {
      const range = option.getData()
      setSelectedRange({ from: range.from, to: range.to })
      onSelect?.({ from: range.from, to: range.to })
      setOpen(false)
    },
    [onSelect],
  )

  const handleCalendarSelect = React.useCallback(
    (range: DateRange | undefined) => {
      if (range?.from && range?.to) {
        setSelectedRange(range)
        onSelect?.(range)
        setOpen(false)
      }
    },
    [onSelect],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[240px] justify-start text-left font-normal", !selectedRange && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedRange?.from ? (
            selectedRange.to ? (
              <>
                {format(selectedRange.from, "LLL dd, y")} - {format(selectedRange.to, "LLL dd, y")}
              </>
            ) : (
              format(selectedRange.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        {!showCalendar ? (
          <Command>
            <CommandInput placeholder="Search date range..." />
            <CommandList>
              <CommandEmpty>No date range found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {dateOptions.map((option) => (
                  <CommandItem key={option.value} onSelect={() => handleSelect(option)}>
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem onSelect={() => setShowCalendar(true)}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Custom Range
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center border-b p-3">
              <Button variant="ghost" size="sm" onClick={() => setShowCalendar(false)}>
                Back to presets
              </Button>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={selectedRange?.from}
              selected={selectedRange}
              onSelect={handleCalendarSelect}
              numberOfMonths={2}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

