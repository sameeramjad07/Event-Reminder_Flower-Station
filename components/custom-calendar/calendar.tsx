"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Types
export type CalendarProps = {
  mode?: "single" | "range" | "multiple";
  selected?: Date | Date[] | DateRange;
  onSelect?: (date: Date | Date[] | DateRange | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  month?: Date;
  onMonthChange?: (date: Date) => void;
  numberOfMonths?: number;
  initialFocus?: boolean;
};

export type DateRange = {
  from: Date;
  to?: Date;
};

// Helper functions
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const isDateInRange = (date: Date, range: DateRange) => {
  const { from, to } = range;
  if (!to) return isSameDay(date, from);

  return date >= from && date <= to;
};

const isDateSelected = (
  date: Date,
  selected: Date | Date[] | DateRange | undefined
): boolean => {
  if (!selected) return false;

  if (selected instanceof Date) {
    return isSameDay(date, selected);
  }

  if (Array.isArray(selected)) {
    return selected.some((selectedDate) => isSameDay(date, selectedDate));
  }

  return isDateInRange(date, selected);
};

const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  disabled,
  className,
  month: externalMonth,
  onMonthChange,
  numberOfMonths = 1,
  initialFocus = false,
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = useState<Date>(
    externalMonth || new Date()
  );
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  // Sync with external month if provided
  useEffect(() => {
    if (externalMonth) {
      setInternalMonth(externalMonth);
    }
  }, [externalMonth]);

  // Set initial focus if needed
  useEffect(() => {
    if (initialFocus) {
      const calendarElement = document.getElementById("custom-calendar");
      if (calendarElement) {
        calendarElement.focus();
      }
    }
  }, [initialFocus]);

  const month = externalMonth || internalMonth;

  const handlePreviousMonth = useCallback(() => {
    const previousMonth = new Date(month);
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    if (!externalMonth) {
      setInternalMonth(previousMonth);
    }

    if (onMonthChange) {
      onMonthChange(previousMonth);
    }
  }, [month, externalMonth, onMonthChange]);

  const handleNextMonth = useCallback(() => {
    const nextMonth = new Date(month);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    if (!externalMonth) {
      setInternalMonth(nextMonth);
    }

    if (onMonthChange) {
      onMonthChange(nextMonth);
    }
  }, [month, externalMonth, onMonthChange]);

  const handleDateSelect = useCallback(
    (date: Date) => {
      if (disabled?.(date)) return;

      if (mode === "single") {
        onSelect?.(date);
      } else if (mode === "multiple") {
        if (!selected || !Array.isArray(selected)) {
          onSelect?.([date]);
          return;
        }

        const isSelected = selected.some((selectedDate) =>
          isSameDay(selectedDate, date)
        );

        if (isSelected) {
          const newSelected = selected.filter(
            (selectedDate) => !isSameDay(selectedDate, date)
          );
          onSelect?.(newSelected.length ? newSelected : undefined);
        } else {
          onSelect?.([...selected, date]);
        }
      } else if (mode === "range") {
        if (!selected || selected instanceof Date || Array.isArray(selected)) {
          onSelect?.({ from: date });
          return;
        }

        const { from, to } = selected;

        if (to || date < from) {
          onSelect?.({ from: date });
        } else {
          onSelect?.({ from, to: date });
        }
      }
    },
    [mode, selected, onSelect, disabled]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, date: Date) => {
      const currentDate = new Date(date);

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          currentDate.setDate(currentDate.getDate() - 1);
          setFocusedDate(currentDate);
          break;
        case "ArrowRight":
          e.preventDefault();
          currentDate.setDate(currentDate.getDate() + 1);
          setFocusedDate(currentDate);
          break;
        case "ArrowUp":
          e.preventDefault();
          currentDate.setDate(currentDate.getDate() - 7);
          setFocusedDate(currentDate);
          break;
        case "ArrowDown":
          e.preventDefault();
          currentDate.setDate(currentDate.getDate() + 7);
          setFocusedDate(currentDate);
          break;
        case "Home":
          e.preventDefault();
          currentDate.setDate(1);
          setFocusedDate(currentDate);
          break;
        case "End":
          e.preventDefault();
          currentDate.setDate(
            getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
          );
          setFocusedDate(currentDate);
          break;
        case "PageUp":
          e.preventDefault();
          currentDate.setMonth(currentDate.getMonth() - 1);
          setFocusedDate(currentDate);
          if (!externalMonth) {
            setInternalMonth(currentDate);
          }
          if (onMonthChange) {
            onMonthChange(currentDate);
          }
          break;
        case "PageDown":
          e.preventDefault();
          currentDate.setMonth(currentDate.getMonth() + 1);
          setFocusedDate(currentDate);
          if (!externalMonth) {
            setInternalMonth(currentDate);
          }
          if (onMonthChange) {
            onMonthChange(currentDate);
          }
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          handleDateSelect(date);
          break;
      }
    },
    [handleDateSelect, externalMonth, onMonthChange]
  );

  // Generate calendar grid
  const renderCalendarMonth = (monthOffset = 0) => {
    const currentMonth = new Date(month);
    currentMonth.setMonth(currentMonth.getMonth() + monthOffset);

    const year = currentMonth.getFullYear();
    const monthIndex = currentMonth.getMonth();

    const daysInMonth = getDaysInMonth(year, monthIndex);
    const firstDay = getFirstDayOfMonth(year, monthIndex);

    // Create array for days of the month
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9" />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const isToday = isSameDay(date, new Date());
      const isSelected = isDateSelected(date, selected);
      const isDisabled = disabled?.(date) || false;
      const isFocused = focusedDate ? isSameDay(date, focusedDate) : false;

      days.push(
        <div key={`day-${day}`} className="h-9 w-9 p-0 font-normal">
          <button
            type="button"
            className={cn(
              "h-9 w-9 rounded-md p-0 font-normal aria-selected:opacity-100",
              "flex items-center justify-center",
              "hover:bg-green-100 dark:hover:bg-green-800/30",
              "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
              isToday ? "border border-green-500" : "",
              isSelected ? "bg-green-600 text-white hover:bg-green-700" : "",
              isDisabled
                ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                : "",
              isFocused && !isSelected
                ? "ring-2 ring-green-500 ring-offset-2"
                : ""
            )}
            disabled={isDisabled}
            onClick={() => handleDateSelect(date)}
            onKeyDown={(e) => handleKeyDown(e, date)}
            tabIndex={isFocused ? 0 : -1}
            aria-selected={isSelected}
            aria-disabled={isDisabled}
            aria-label={date.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            data-date={date.toISOString()}
            ref={(el) => {
              if (isFocused && el) {
                el.focus();
              }
            }}
          >
            {day}
          </button>
        </div>
      );
    }

    return (
      <div key={`month-${monthOffset}`} className="space-y-4">
        <div className="text-sm font-medium">
          {formatMonthYear(currentMonth)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-sm">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="h-9 flex items-center justify-center text-xs font-medium text-green-600 dark:text-green-400"
            >
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  return (
    <div
      id="custom-calendar"
      className={cn(
        "p-3 bg-white dark:bg-gray-800 rounded-md border border-green-100 dark:border-green-800 shadow-sm",
        className ?? ""
      )}
      tabIndex={0}
    >
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 bg-transparent border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"
          onClick={handlePreviousMonth}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 bg-transparent border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"
          onClick={handleNextMonth}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-8">
        {Array.from({ length: numberOfMonths }).map((_, i) =>
          renderCalendarMonth(i)
        )}
      </div>
    </div>
  );
}
