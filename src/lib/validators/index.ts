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
  confirmPassword: z
    .string()
    .min(1, { message: "Confirm password is required" }),
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
  age: z.string().min(1, { message: "Age is required" }),
  birthPlace: z.string().min(1, { message: "Birth place is required" }),
  weight: z.string().min(1, { message: "Weight is required" }),
  height: z.string().min(1, { message: "Height is required" }),
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNumber: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherContactNumber: z.string().optional(),
  guardianName: z.string().optional(),
  guardianRelation: z.string().optional(),
  guardianContactNumber: z.string().optional(),
  doctorName: z.string().optional(),
  doctorSpecialization: z.string().optional(),
  doctorContactNumber: z.string().optional(),
  referredBy: z.string().optional(),
  consultationReason: z
    .string()
    .min(1, { message: "Reason for consultation is required" }),
  maritalStatus: z.string().min(1, { message: "Marital status is required" }),
  occupation: z.string().min(1, { message: "Occupation is required" }),
  contactNumber: z.string().min(1, { message: "Contact number is required" }),
  branchId: z.string().min(1, { message: "Branch is required" }),
});

export const PresentIllnessSchema = z.object({
  name: z.string().min(1, { message: "Present illness is required" }),
});

export const MedicalHistorySchema = z.object({
  currentMedication: z
    .string()
    .min(1, { message: "Current medication is required" }),
  previousHospitalization: z
    .string()
    .min(1, { message: "Previous hospitalization is required" }),
  allergies: z.string().min(1, { message: "Allergies is required" }),
  developmentalAbnormalities: z
    .string()
    .min(1, { message: "Developmental abnormalities is required" }),
  histories: z.string().array().min(1, { message: "Histories is required" }),
  otherHistories: z.string().optional(),
  medicalCareReaction: z
    .string()
    .min(1, { message: "Medical care reaction is required" }),
  yesSpecify: z.string().optional(),
  socialFamilyHistory: z
    .string()
    .min(1, { message: "Social and family history is required" }),
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
  diagnosis: z.string().min(1, { message: "Diagnosis is required" }),
  otherDiagnosis: z.string().optional(),
  remarks: z.string().optional(),
});

export const DentalHistorySchema = z.object({
  toothNumber: z.coerce
    .number()
    .min(1, { message: "Tooth number is required" }),
  service: z.string().min(1, { message: "Service is required" }),
  remarks: z.string().optional(),
  dentist: z.string().min(1, { message: "Dentist is required" }),
  paymentMethod: z.string().optional(),
  status: z.string().optional(),
  amount: z.string().optional(),
});

export const AddStockSchema = z.object({
  supplyName: z.string().min(1, { message: "Supply name is required" }),
  quantity: z.coerce.number().min(1, { message: "Quantity is required" }),
  receivedBy: z.string().min(1, { message: "Received by is required" }),
  remarks: z.string().optional(),
});

export const DeductStockSchema = z.object({
  supplyName: z.string().min(1, { message: "Supply name is required" }),
  quantity: z.coerce.number().min(1, { message: "Quantity is required" }),
  dispatchedBy: z.string().min(1, { message: "Dispatched by is required" }),
  remarks: z.string().optional(),
});
