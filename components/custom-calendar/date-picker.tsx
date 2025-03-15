"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "./calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

export interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  popoverClassName?: string;
  buttonClassName?: string;
  disabledDates?: (date: Date) => boolean;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Select date",
  disabled = false,
  className,
  popoverClassName,
  buttonClassName,
  disabledDates,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sync with external date if provided
  useEffect(() => {
    if (date !== selectedDate) {
      setSelectedDate(date);
    }
  }, [date]);

  const handleSelect = (date: Date | Date[] | DateRange | undefined) => {
    if (date instanceof Date || date === undefined) {
      setSelectedDate(date);
      onDateChange?.(date);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate ? "text-muted-foreground" : "",
            buttonClassName ?? ""
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
          {selectedDate ? format(selectedDate, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-auto p-0", popoverClassName ?? "")}
        align="start"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={disabledDates}
          initialFocus
          className={className}
        />
      </PopoverContent>
    </Popover>
  );
}
