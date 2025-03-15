"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { saveReminders } from "@/app/actions";
import type { EventReminder } from "@/lib/types";
import { toast } from "sonner";

interface ReminderFormProps {
  reminders: EventReminder[];
  setReminders: React.Dispatch<React.SetStateAction<EventReminder[]>>;
  onAddReminder: () => void;
  onRemoveReminder: (id: number) => void;
  onSuccess: () => void;
}

export function ReminderForm({
  reminders,
  setReminders,
  onAddReminder,
  onRemoveReminder,
  onSuccess,
}: ReminderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateReminder = (
    id: number,
    field: keyof EventReminder,
    value: string
  ) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id ? { ...reminder, [field]: value } : reminder
      )
    );
  };

  const handleDateSelect = (id: number, date: Date | undefined) => {
    if (date) {
      updateReminder(id, "eventDate", date.toISOString().split("T")[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    const isValid = reminders.every(
      (reminder) =>
        reminder.eventName &&
        reminder.eventDate &&
        reminder.customerEmail &&
        (reminder.eventType !== "Other" || reminder.customEventType)
    );

    if (!isValid) {
      toast.error("Please fill in all required fields for each reminder.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await saveReminders(reminders);

      if (result.success) {
        toast.success("Your event reminders have been saved.");
        onSuccess();
      } else {
        throw new Error(result.error || "Failed to save reminders");
      }
    } catch (error) {
      toast.error("Failed to save reminder");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {reminders.map((reminder, index) => (
        <div key={reminder.id} className="space-y-4 p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Reminder {index + 1}</h3>
            {reminders.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveReminder(reminder.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`eventName-${reminder.id}`}>Event Name</Label>
              <Input
                id={`eventName-${reminder.id}`}
                value={reminder.eventName}
                onChange={(e) =>
                  updateReminder(reminder.id, "eventName", e.target.value)
                }
                placeholder="Enter event name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`eventDate-${reminder.id}`}>Event Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !reminder.eventDate ? "text-muted-foreground" : ""
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {reminder.eventDate
                      ? format(new Date(reminder.eventDate), "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      reminder.eventDate
                        ? new Date(reminder.eventDate)
                        : undefined
                    }
                    onSelect={(date) => handleDateSelect(reminder.id, date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`customerEmail-${reminder.id}`}>Email</Label>
              <Input
                id={`customerEmail-${reminder.id}`}
                type="email"
                value={reminder.customerEmail}
                onChange={(e) =>
                  updateReminder(reminder.id, "customerEmail", e.target.value)
                }
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`eventType-${reminder.id}`}>Event Type</Label>
              <Select
                value={reminder.eventType}
                onValueChange={(value) =>
                  updateReminder(reminder.id, "eventType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Birthday">Birthday</SelectItem>
                  <SelectItem value="Anniversary">Anniversary</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reminder.eventType === "Other" && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`customEventType-${reminder.id}`}>
                  Custom Event Type
                </Label>
                <Input
                  id={`customEventType-${reminder.id}`}
                  value={reminder.customEventType}
                  onChange={(e) =>
                    updateReminder(
                      reminder.id,
                      "customEventType",
                      e.target.value
                    )
                  }
                  placeholder="Enter custom event type"
                  required
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {reminders.length < 3 && (
        <Button
          type="button"
          variant="outline"
          onClick={onAddReminder}
          className="w-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Another Reminder ({reminders.length}/3)
        </Button>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Reminders"}
        </Button>
      </div>
    </form>
  );
}
