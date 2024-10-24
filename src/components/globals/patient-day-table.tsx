"use client";

import { fetchCalendarEvents } from "@/actions/appointments";
import React, { useEffect, useState } from "react";
import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

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

export type AppointmentColumn = {
  name: string;
  service: string;
};

const columns: ColumnDef<AppointmentColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "service",
    header: "Service",
  },
];

const isToday = (dateString: string | undefined): boolean => {
  if (!dateString) return false;
  const eventDate = new Date(dateString);
  const today = new Date();
  return (
    eventDate.getFullYear() === today.getFullYear() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getDate() === today.getDate()
  );
};

const PatientDayTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  useEffect(() => {
    const getEvents = async () => {
      try {
        setIsLoading(true);
        const calendarEvents = await fetchCalendarEvents();
        // Filter events that are happening today
        const todayEvents = calendarEvents.filter((event: CalendarEvent) =>
          isToday(event.start.dateTime || event.start.date)
        );

        setEvents(todayEvents);
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getEvents();
  }, []);

  const formattedData: AppointmentColumn[] =
    events?.map((item) => ({
      name: item.summary,
      service: item.description || "N/A",
    })) || [];

  return (
    <DataTable
      loading={isLoading}
      searchKey="name"
      columns={columns}
      data={formattedData}
    />
  );
};

export default PatientDayTable;
