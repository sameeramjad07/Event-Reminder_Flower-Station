"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createEvent, updateEvent } from "@/app/actions/events";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EventFormProps {
  initialData?: {
    id: string;
    title: string;
    description?: string;
    date: string;
    time?: string;
    location?: string;
    type: string;
    customType?: string;
    attendees?: string[];
  };
  isEditing?: boolean;
}

export default function EventForm({
  initialData,
  isEditing = false,
}: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    date: initialData?.date ? new Date(initialData.date) : undefined,
    time: initialData?.time || "",
    location: initialData?.location || "",
    type: initialData?.type || "Birthday",
    customType: initialData?.customType || "",
    attendees: initialData?.attendees?.join(", ") || "",
  });

  const router = useRouter();

  useEffect(() => {
    console.log("EventForm component mounted", {
      isEditing,
      initialData: !!initialData,
    });
  }, [isEditing, initialData]);

  const handleChange = (field: string, value: any) => {
    console.log(`Field changed: ${field}`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting event form", formData);
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.title || !formData.date || !formData.type) {
        console.error("Form validation failed: missing required fields");
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      if (formData.type === "Other" && !formData.customType) {
        console.error("Form validation failed: missing custom event type");
        toast.error("Please specify a custom event type");
        setIsSubmitting(false);
        return;
      }

      // Prepare form data
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("date", formData.date!.toISOString());
      submitData.append("time", formData.time);
      submitData.append("location", formData.location);
      submitData.append("type", formData.type);
      submitData.append("customType", formData.customType);
      submitData.append("attendees", formData.attendees);

      let result;

      if (isEditing && initialData?.id) {
        console.log("Updating event:", initialData.id);
        result = await updateEvent(initialData.id, submitData);
      } else {
        console.log("Creating new event");
        result = await createEvent(submitData);
      }

      console.log("Event save result:", result);

      if (result.success) {
        toast.success("Event saved successfully");
        router.push("/dashboard/events");
        router.refresh();
      } else {
        throw new Error(result.message || "Failed to save event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-green-800">
              Event Title <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter event title"
              required
              className="border-green-200 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-green-800">
              Event Date <span className="text-rose-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-green-200",
                    !formData.date ? "text-green-500" : ""
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-green-600" />
                  {formData.date ? format(formData.date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-green-100">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => handleChange("date", date)}
                  initialFocus
                  className="rounded-md border-green-100"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="time" className="text-green-800">
              Event Time
            </Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-green-600" />
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-green-800">
              Event Type <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger className="border-green-200 focus:ring-green-500">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent className="border-green-100">
                <SelectItem value="Birthday">Birthday</SelectItem>
                <SelectItem value="Anniversary">Anniversary</SelectItem>
                <SelectItem value="Wedding">Wedding</SelectItem>
                <SelectItem value="Celebration">Celebration</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {formData.type === "Other" && (
          <div className="space-y-2">
            <Label htmlFor="customType" className="text-green-800">
              Custom Event Type <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="customType"
              value={formData.customType}
              onChange={(e) => handleChange("customType", e.target.value)}
              placeholder="Specify event type"
              required
              className="border-green-200 focus:border-green-500 focus:ring-green-500"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="location" className="text-green-800">
            Location
          </Label>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-green-600" />
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Enter location (optional)"
              className="border-green-200 focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-green-800">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter event description (optional)"
            rows={4}
            className="border-green-200 focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attendees" className="text-green-800">
            Attendees (comma separated emails)
          </Label>
          <Textarea
            id="attendees"
            value={formData.attendees}
            onChange={(e) => handleChange("attendees", e.target.value)}
            placeholder="Enter email addresses separated by commas (optional)"
            rows={2}
            className="border-green-200 focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/events")}
          className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update Event"
            : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
