"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReminderForm } from "./reminder-form";
import type { EventReminder } from "@/lib/types";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReminderModal({ isOpen, onClose }: ReminderModalProps) {
  const [reminders, setReminders] = useState<EventReminder[]>([
    {
      id: 1,
      eventName: "",
      eventDate: "",
      customerEmail: "",
      eventType: "Birthday",
      customEventType: "",
    },
  ]);

  const handleAddReminder = () => {
    if (reminders.length < 3) {
      const newId = Math.max(...reminders.map((r) => r.id), 0) + 1;
      setReminders([
        ...reminders,
        {
          id: newId,
          eventName: "",
          eventDate: "",
          customerEmail: "",
          eventType: "Birthday",
          customEventType: "",
        },
      ]);
    }
  };

  const handleRemoveReminder = (id: number) => {
    if (reminders.length > 1) {
      setReminders(reminders.filter((reminder) => reminder.id !== id));
    }
  };

  const handleSuccess = () => {
    setReminders([
      {
        id: 1,
        eventName: "",
        eventDate: "",
        customerEmail: "",
        eventType: "Birthday",
        customEventType: "",
      },
    ]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Set Event Reminders
          </DialogTitle>
        </DialogHeader>

        <ReminderForm
          reminders={reminders}
          setReminders={setReminders}
          onAddReminder={handleAddReminder}
          onRemoveReminder={handleRemoveReminder}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
