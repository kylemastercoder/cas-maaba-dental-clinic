
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

export const PatientSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  suffix: z.string().optional(),
  facebookName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
  houseNumber: z.string().min(1, { message: "House number is required" }),
  region: z.string().min(1, { message: "Region is required" }),
  province: z.string().min(1, { message: "Province is required" }),
  municipality: z.string().min(1, { message: "Municipality is required" }),
  barangay: z.string().min(1, { message: "Barangay is required" }),
  sex: z.string().min(1, { message: "Sex is required" }),
  birthdate: z.string().min(1, { message: "Date of birth is required" }),
  maritalStatus: z.string().min(1, { message: "Marital status is required" }),
  occupation: z.string().min(1, { message: "Occupation is required" }),
  contactNumber: z.string().min(1, { message: "Contact number is required" }),
});
