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
import { PlusCircle, Trash2 } from "lucide-react";
import { DatePicker } from "@/components/custom-calendar/date-picker";
import { useToast } from "@/hooks/use-toast";
import { saveReminders } from "@/app/actions";
import type { EventReminder } from "@/lib/types";

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
  const { toast } = useToast();

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
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields for each reminder.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await saveReminders(reminders);

      if (result.success) {
        toast({
          title: "Success!",
          description: "Your event reminders have been saved.",
        });
        onSuccess();
      } else {
        throw new Error(result.error || "Failed to save reminders");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save reminders",
        variant: "destructive",
      });
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
              <DatePicker
                date={
                  reminder.eventDate ? new Date(reminder.eventDate) : undefined
                }
                onDateChange={(date) => handleDateSelect(reminder.id, date)}
                placeholder="Select date"
                buttonClassName="w-full border-green-200 focus:border-green-500 focus:ring-green-500"
              />
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
