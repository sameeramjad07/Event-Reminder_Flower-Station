"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { ReminderModal } from "./reminder-model";

export function ReminderButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2"
      >
        <CalendarIcon className="h-5 w-5" />
        Set Event Reminder
      </Button>

      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
