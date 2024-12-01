/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import axios from "axios";

// Helper function to fetch events for a single branch
const fetchBranchEvents = async (
  branch: { name: string; gmail: string | null },
  timeMin: string,
  timeMax: string
) => {
  if (!branch.gmail) return []; // Skip branches without a Gmail ID

  try {
    const response = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        branch.gmail
      )}/events?key=${
        process.env.REACT_APP_GOOGLE_API_KEY
      }&timeMin=${timeMin}&timeMax=${timeMax}`
    );

    return response.data.items.map((event: any) => ({
      ...event,
      branch: branch.name,
    }));
  } catch (error) {
    console.error(`Error fetching events for branch ${branch.name}:`, error);
    return [];
  }
};

// Function to fetch events for all branches within a specific time range
const fetchCalendarEvents = async (timeMin: string, timeMax: string) => {
  try {
    const branches = await db.branch.findMany(); // Fetch all branches from the database

    const eventsPromises = branches.map((branch) =>
      fetchBranchEvents(branch, timeMin, timeMax)
    );
    const allBranchEvents = await Promise.all(eventsPromises);

    // Flatten the array of events and sort by start time
    const combinedEvents = allBranchEvents
      .flat()
      .sort(
        (a, b) =>
          new Date(a.start.dateTime).getTime() -
          new Date(b.start.dateTime).getTime()
      );

    return combinedEvents;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return [];
  }
};

// Function to fetch today's events
export const fetchCalendarEventsToday = async () => {
  const today = new Date();
  const timeMin = new Date(today.setHours(0, 0, 0, 0)).toISOString(); // Start of today
  const timeMax = new Date(today.setHours(23, 59, 59, 999)).toISOString(); // End of today

  return fetchCalendarEvents(timeMin, timeMax);
};

// Function to fetch tomorrow's events
export const fetchCalendarEventsTomorrow = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Move to the next day
  const timeMin = new Date(tomorrow.setHours(0, 0, 0, 0)).toISOString(); // Start of tomorrow
  const timeMax = new Date(tomorrow.setHours(23, 59, 59, 999)).toISOString(); // End of tomorrow

  return fetchCalendarEvents(timeMin, timeMax);
};
