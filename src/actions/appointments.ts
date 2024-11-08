/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axios from "axios";

// Function to fetch today's events for both Dasma and Molino branches
export const fetchCalendarEventsToday = async () => {
  const today = new Date();
  const timeMin = new Date(today.setHours(0, 0, 0, 0)).toISOString(); // Start of today
  const timeMax = new Date(today.setHours(23, 59, 59, 999)).toISOString(); // End of today

  try {
    // Fetch Dasma events
    const dasmaResponse = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        process.env.REACT_APP_CALENDAR_ID!
      )}/events?key=${
        process.env.REACT_APP_GOOGLE_API_KEY
      }&timeMin=${timeMin}&timeMax=${timeMax}`
    );

    // Fetch Molino events
    const molinoResponse = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        process.env.REACT_APP_CALENDAR_ID2!
      )}/events?key=${
        process.env.REACT_APP_GOOGLE_API_KEY
      }&timeMin=${timeMin}&timeMax=${timeMax}`
    );

    // Add branch property to each event
    const dasmaEvents = dasmaResponse.data.items.map((event: any) => ({
      ...event,
      branch: "Cas-Maaba Dasmariñas",
    }));
    const molinoEvents = molinoResponse.data.items.map((event: any) => ({
      ...event,
      branch: "Cas-Maaba Molino",
    }));

    // Combine events from both branches
    const combinedEvents = [...dasmaEvents, ...molinoEvents];

    // Sort combined events by start time
    const sortedEvents = combinedEvents.sort(
      (a, b) =>
        new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime()
    );

    return sortedEvents;
  } catch (error) {
    console.error("Error fetching today's calendar events:", error);
    return [];
  }
};

// Function to fetch tomorrow's events for both Dasma and Molino branches
export const fetchCalendarEventsTomorrow = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Move to the next day
  const timeMin = new Date(tomorrow.setHours(0, 0, 0, 0)).toISOString(); // Start of tomorrow
  const timeMax = new Date(tomorrow.setHours(23, 59, 59, 999)).toISOString(); // End of tomorrow

  try {
    // Fetch Dasma events
    const dasmaResponse = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        process.env.REACT_APP_CALENDAR_ID!
      )}/events?key=${
        process.env.REACT_APP_GOOGLE_API_KEY
      }&timeMin=${timeMin}&timeMax=${timeMax}`
    );

    // Fetch Molino events
    const molinoResponse = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        process.env.REACT_APP_CALENDAR_ID2!
      )}/events?key=${
        process.env.REACT_APP_GOOGLE_API_KEY
      }&timeMin=${timeMin}&timeMax=${timeMax}`
    );

    // Add branch property to each event
    const dasmaEvents = dasmaResponse.data.items.map((event: any) => ({
      ...event,
      branch: "Cas-Maaba Dasmariñas",
    }));
    const molinoEvents = molinoResponse.data.items.map((event: any) => ({
      ...event,
      branch: "Cas-Maaba Molino",
    }));

    // Combine events from both branches
    const combinedEvents = [...dasmaEvents, ...molinoEvents];

    // Sort combined events by start time
    const sortedEvents = combinedEvents.sort(
      (a, b) =>
        new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime()
    );

    return sortedEvents;
  } catch (error) {
    console.error("Error fetching tomorrow's calendar events:", error);
    return [];
  }
};
