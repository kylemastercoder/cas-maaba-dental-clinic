import { z } from "zod";

export const UserLoginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const BranchSchema = z.object({
  name: z.string().min(1, { message: "Branch name is required" }),
  address: z.string().min(1, { message: "Branch address is required" }),
});

export const ResetPasswordSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
  password: z.string().min(1, { message: "New password is required" }),
  confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
});

export const UserRegistrationSchema = z
  .object({
    username: z.string().min(1, { message: "Username is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    role: z.string().min(1, { message: "Role is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character",
      }),
    cpassword: z.string().min(1, { message: "Confirm password is required" }),
    branch: z.string().min(1, { message: "Branch is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.cpassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords must match",
        path: ["cpassword"],
      });
    }
  });

export const PatientSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  suffix: z.string().optional(),
  facebookName: z.string().optional(),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
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
  branchId: z.string().min(1, { message: "Branch is required" }),
});

export const ServiceSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
});

export const NotifySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email address is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  followUpDate: z.string().min(1, { message: "Follow-up date is required" }),
});

export const SupplySchema = z.object({
  sku: z.string().min(1, { message: "SKU is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  stocks: z.coerce.number().min(1, { message: "Stocks is required" }),
  unit: z.string().min(1, { message: "Unit is required" }),
  used: z.coerce.number().optional(),
  branchId: z.string().min(1, { message: "Branch is required" }),
});

export const TreatmentPlanSchema = z.object({
  toothNumber: z.coerce
    .number()
    .min(1, { message: "Tooth number is required" }),
  service: z.string().min(1, { message: "Service is required" }),
  diagnosis: z.string().min(1, { message: "Diagnosis is required" }),
  paymentMethod: z.string().min(1, { message: "Payment method is required" }),
  isPaid: z.boolean().optional(),
  status: z.string().min(1, { message: "Status is required" }),
  remarks: z.string().optional(),
});
