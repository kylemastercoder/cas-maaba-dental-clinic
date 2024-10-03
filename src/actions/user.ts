/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { UserLoginSchema, UserRegistrationSchema } from "@/lib/validators";
import * as jose from "jose";
import { cookies } from "next/headers";

export const getAllUsers = async () => {
  try {
    const data = await db.user.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        branch: true,
      },
    });

    if (!data) {
      return { error: "No user found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const getAllBranchHead = async () => {
  try {
    const data = await db.user.findMany({
      where: {
        role: "Branch Head",
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        branch: true,
      },
    });

    if (!data) {
      return { error: "No user found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const loginUser = async (values: z.infer<typeof UserLoginSchema>) => {
  const validatedField = UserLoginSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { username, password } = validatedField.data;

  try {
    const user = await db.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const isCorrectPassword = bcryptjs.compareSync(password, user.password);

    if (!isCorrectPassword) {
      return { error: "Invalid Password" };
    }

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const jwt = await new jose.SignJWT({})
      .setProtectedHeader({ alg })
      .setExpirationTime("72h")
      .setSubject(user.id.toString())
      .sign(secret);

    // Set the cookie with the JWT
    cookies().set("Authorization", jwt, {
      httpOnly: true, // Set to true for security
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 3, // Cookie expiration (3 days in seconds)
      sameSite: "strict", // Adjust according to your needs
      path: "/", // Adjust path as needed
    });

    return { token: jwt };
  } catch (error: any) {
    return {
      error: `Failed to sign in user. Please try again. ${error.message || ""}`,
    };
  }
};

export const createUser = async (
  values: z.infer<typeof UserRegistrationSchema>
) => {
  const validatedField = UserRegistrationSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, username, password, role } = validatedField.data;

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const user = await db.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role,
      },
    });

    return { success: "User created successfully", user };
  } catch (error: any) {
    return {
      error: `Failed to create user. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateUser = async (
  values: z.infer<typeof UserRegistrationSchema>,
  userId: string
) => {
  if (!userId) {
    return { error: "User ID is required." };
  }

  const validatedField = UserRegistrationSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, username, password, role } = validatedField.data;

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const user = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        username,
        password: hashedPassword,
        role,
      },
    });

    return { success: "User updated successfully", user };
  } catch (error: any) {
    return {
      error: `Failed to update user. Please try again. ${error.message || ""}`,
    };
  }
};

export const deleteUser = async (userId: string) => {
  if (!userId) {
    return { error: "User ID is required." };
  }

  try {
    const user = await db.user.delete({
      where: {
        id: userId,
      },
    });

    return { success: "User deleted successfully", user };
  } catch (error: any) {
    return {
      error: `Failed to delete user. Please try again. ${error.message || ""}`,
    };
  }
};
