"use server";

import { z } from "zod";
import { NotifySchema } from "./validators";
import nodemailer from "nodemailer";
import { NotifyEmailHTML } from "@/components/globals/notify-email-html";

export const sendEmail = async (values: z.infer<typeof NotifySchema>) => {
  const htmlContent = await NotifyEmailHTML({
    date: new Date(),
    name: values.name,
    title: values.title,
    description: values.description,
    followUpDate: values.followUpDate
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "casmaabadentalservices@gmail.com",
      pass: "hvyncisjmrgotigs",
    },
  });

  const message = {
    from: "casmaabadentalservices@gmail.com",
    to: values.email,
    subject: "Cas-Maaba Dental Clinic",
    text: `Notification from Cas-Maaba Dental Clinic`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(message);
    return {success: true, message: "Notification sent successfully"};
  } catch (error) {
    console.error("Error sending notification", error);
    return {message: "An error occurred. Please try again."};
  }
};
