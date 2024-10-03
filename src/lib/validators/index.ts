import { z } from "zod";

export const UserLoginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const BranchSchema = z.object({
  name: z.string().min(1, { message: "Branch name is required" }),
  address: z.string().min(1, { message: "Branch address is required" }),
  branchHead: z.string().min(1, { message: "Branch head is required" }),
});

export const UserRegistrationSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});
