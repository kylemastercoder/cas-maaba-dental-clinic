"use server";

import db from "@/lib/db";
import { ResetPasswordSchema } from "@/lib/validators";
import { z } from "zod";
import bcryptjs from "bcryptjs";

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>
) => {
  const validatedField = ResetPasswordSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { userId, password, confirmPassword } = validatedField.data;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const data = await db.user.update({
      data: {
        password: hashedPassword,
      },
      where: {
        id: userId,
      },
    });

    return { success: "Password reset successfully.", data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};
