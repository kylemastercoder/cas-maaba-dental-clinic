"use server";

import axios from "axios";

// Function to fetch events for today
export const fetchCalendarEventsToday = async () => {
  const today = new Date();
  const timeMin = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const timeMax = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  try {
    // Fetch events from the first calendar
    const response1 = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        "casmaabadental@gmail.com"
      )}/events?key=${
        process.env.REACT_APP_GOOGLE_API_KEY
      }&timeMin=${timeMin}&timeMax=${timeMax}`
    );

    // Fetch events from the second calendar
    const response2 = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        "casmaabadentalservices@gmail.com"
      )}/events?key=${
        process.env.REACT_APP_GOOGLE_API_KEY
      }&timeMin=${timeMin}&timeMax=${timeMax}`
    );

    // Combine events from both calendars
    const combinedEvents = [...response1.data.items, ...response2.data.items];

    // Sort combined events by start time (ascending order)
    const sortedEvents = combinedEvents.sort(
      (a, b) =>
        new Date(a.start.dateTime).getTime() -
        new Date(b.start.dateTime).getTime()
    );

    return sortedEvents; // Return the sorted events for use in your table
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return [];
  }
};

// Function to fetch events for tomorrow
export const fetchCalendarEventsTomorrow = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Move to the next day
  const timeMin = new Date(tomorrow.setHours(0, 0, 0, 0)).toISOString(); // Start of tomorrow
  const timeMax = new Date(tomorrow.setHours(23, 59, 59, 999)).toISOString(); // End of tomorrow

  try {
    // Fetch events from the first calendar
    const response1 = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        "casmaabadental@gmail.com"
      )}/events?key=${
        process.env.REACT_APP_GOOGLE_API_KEY
      }&timeMin=${timeMin}&timeMax=${timeMax}`
    );

    // Fetch events from the second calendar
    const response2 = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        "casmaabadentalservices@gmail.com"
      )}/events?key=${
        process.env.REACT_APP_GOOGLE_API_KEY
      }&timeMin=${timeMin}&timeMax=${timeMax}`
    );

    // Combine events from both calendars
    const combinedEvents = [...response1.data.items, ...response2.data.items];

    // Sort combined events by start time (ascending order)
    const sortedEvents = combinedEvents.sort(
      (a, b) =>
        new Date(a.start.dateTime).getTime() -
        new Date(b.start.dateTime).getTime()
    );

    return sortedEvents; // Return the sorted events for use in your table
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return [];
  }
};
