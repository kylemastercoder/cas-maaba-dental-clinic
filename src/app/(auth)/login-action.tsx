/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function loginAction(formData: FormData): Promise<string> {
  // Get the data off the form
  const username = formData.get("username");
  const password = formData.get("password");

  // Send to our API route
  const response = await fetch("http://localhost:3000/api/sign-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorText = await response.text(); // Read response as text
    console.error("Error response:", errorText); // Log the response
    throw new Error(`Login failed: ${errorText}`); // Throw an error with the response
  }

  // If the response is okay, parse the JSON
  const json = await response.json();

  // Set the cookie
  cookies().set("Authorization", json.token, {
    secure: true,
    httpOnly: true,
    expires: new Date(Date.now() + 72 * 60 * 60 * 1000),
    path: "/",
    sameSite: "strict",
  });

  // Redirect if successful
  redirect("/");
}
