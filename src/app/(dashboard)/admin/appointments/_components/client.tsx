/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { fetchCalendarEvents } from "@/actions/appointments";
import React, { useEffect, useState } from "react";

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

const AppointmentClient = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const calendarEvents = await fetchCalendarEvents();
        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      }
    };

    getEvents();
  }, []);
  return (
    <div>
      <iframe
        src="https://calendar.google.com/calendar/embed?src=casmaabadental%40gmail.com&amp;ctz=Asia%2FManila"
        width="100%"
        height="1000"
        frameBorder="0"
        scrolling="no"
      ></iframe>

      {/* <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50">Event Title</th>
            <th className="px-6 py-3 bg-gray-50">Start Date</th>
            <th className="px-6 py-3 bg-gray-50">End Date</th>
            <th className="px-6 py-3 bg-gray-50">Description</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.map((event) => (
            <tr key={event.id}>
              <td className="px-6 py-4">{event.summary || "No Title"}</td>
              <td className="px-6 py-4">
                {new Date(
                  event.start.dateTime || event.start.date || ""
                ).toLocaleString()}
              </td>
              <td className="px-6 py-4">
                {new Date(
                  event.end.dateTime || event.end.date || ""
                ).toLocaleString()}
              </td>
              <td className="px-6 py-4">
                {event.description || "No Description"}
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default AppointmentClient;
