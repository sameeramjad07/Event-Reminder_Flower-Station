"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Flower } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect } from "react";

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  type: string;
}

export default function UpcomingEvents({ events }: { events: Event[] }) {
  useEffect(() => {
    console.log("UpcomingEvents component mounted", {
      eventCount: events.length,
    });
  }, [events.length]);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <Flower className="h-12 w-12 text-green-300 mb-2" />
        <p className="text-green-600">No upcoming events</p>
        <Link href="/dashboard/events/new" className="mt-4">
          <Button className="cursor-pointer bg-green-600 hover:bg-green-700">
            Create your first event
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Link
          key={event.id}
          href={`/dashboard/events/${event.id}`}
          className="block"
        >
          <div className="flex items-start justify-between p-4 hover:bg-green-50 rounded-lg transition-colors">
            <div className="space-y-1">
              <h3 className="font-medium text-green-800">{event.title}</h3>
              <div className="flex items-center text-sm text-green-600">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{format(new Date(event.date), "PPP")}</span>
              </div>
              {event.time && (
                <div className="flex items-center text-sm text-green-600">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{event.time}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center text-sm text-green-600">
                  <MapPin className="mr-1 h-4 w-4" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate max-w-[200px]">
                          {event.location}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{event.location}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
            <div className="text-xs font-medium">
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                {event.type}
              </span>
            </div>
          </div>
        </Link>
      ))}

      <div className="pt-2">
        <Link href="/dashboard/events">
          <Button
            variant="outline"
            className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
          >
            View all events
          </Button>
        </Link>
      </div>
    </div>
  );
}
