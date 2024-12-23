"use client";

import { parseAddress } from "@/lib/utils";
import { PatientSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Branch, Patient } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Heading } from "@/components/ui/heading";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useAddressData } from "@/lib/address-selection";
import { useSavePatient } from "@/data/patient";

const PatientForm = ({
  initialData,
  branches,
}: {
  initialData: Patient | null;
  branches: Branch[];
}) => {
  const router = useRouter();
  const addressComponents = parseAddress(initialData?.address ?? "");
  const params = useParams();

  const title = initialData ? "Edit Patient" : "Add Patient";
  const description = initialData
    ? "Make sure to click save changes after you update the patient."
    : "Please fill the required fields to add a new patient.";
  const action = initialData ? "Save Changes" : "Save Patient";

  const form = useForm<z.infer<typeof PatientSchema>>({
    resolver: zodResolver(PatientSchema),
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
          firstName: initialData.firstName ?? "",
          middleName: initialData.middleName ?? "",
          lastName: initialData.lastName ?? "",
          suffix: initialData.suffix ?? "",
          facebookName: initialData.facebookName ?? "",
          email: initialData.email ?? "",
          houseNumber: addressComponents.houseNumber ?? "",
          region: addressComponents.region ?? "CALABARZON",
          province: addressComponents.province ?? "Cavite",
          municipality: addressComponents.municipality ?? "",
          barangay: addressComponents.barangay ?? "",
          sex: initialData.sex ?? "",
          birthdate: initialData.birthdate ?? "",
          maritalStatus: initialData.maritalStatus ?? "",
          occupation: initialData.occupation ?? "",
          contactNumber: initialData.contactNumber ?? "",
          fatherName: initialData.fatherName ?? "",
          fatherOccupation: initialData.fatherOccupation ?? "",
          fatherContactNumber: initialData.fatherContactNumber ?? "",
          motherName: initialData.motherName ?? "",
          motherOccupation: initialData.motherOccupation ?? "",
          motherContactNumber: initialData.motherContactNumber ?? "",
          guardianName: initialData.guardianName ?? "",
          guardianRelation: initialData.guardianRelation ?? "",
          guardianContactNumber: initialData.guardianContactNumber ?? "",
          doctorName: initialData.doctorName ?? "",
          doctorSpecialization: initialData.doctorSpecialization ?? "",
          doctorContactNumber: initialData.doctorContactNumber ?? "",
          referredBy: initialData.referredBy ?? "",
        }
      : {
          firstName: "",
          middleName: "",
          lastName: "",
          suffix: "",
          facebookName: "",
          email: "",
          houseNumber: "",
          region: "CALABARZON",
          province: "Cavite",
          municipality: "",
          barangay: "",
          sex: "",
          birthdate: "",
          age: "",
          birthPlace: "",
          weight: "",
          height: "",
          maritalStatus: "",
          occupation: "",
          contactNumber: "",
          fatherName: "",
          fatherOccupation: "",
          fatherContactNumber: "",
          motherName: "",
          motherOccupation: "",
          motherContactNumber: "",
          guardianName: "",
          guardianRelation: "",
          guardianContactNumber: "",
          doctorName: "",
          doctorSpecialization: "",
          doctorContactNumber: "",
          referredBy: "",
          consultationReason: "",
          branchId: Array.isArray(params.branchId)
            ? params.branchId[0]
            : params.branchId ?? "",
        },
  });

  const { mutate: savePatient, isPending: isLoading } =
    useSavePatient(initialData);

  async function onSubmit(values: z.infer<typeof PatientSchema>) {
    savePatient(values, {
      onSuccess: () =>
        router.push(
          `${
            params.branchId ? `/${params.branchId}/patients` : "/admin/patients"
          }`
        ),
    });
  }

  const selectedRegionName = form.watch("region");
  const selectedProvinceName = form.watch("province");
  const selectedMunicipalityName = form.watch("municipality");

  const {
    regionOptions,
    provinceOptions,
    municipalityOptions,
    barangayOptions,
  } = useAddressData(
    selectedRegionName,
    selectedProvinceName,
    selectedMunicipalityName
  );

  return (
    <Form {...form}>
      <Heading title={title} description={description} />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-3">
          <div className="grid md:grid-cols-4 grid-cols-1 gap-3">
            <CustomFormField
              label="First Name"
              name="firstName"
              placeholder="Juan"
              isRequired
              type="text"
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
            <CustomFormField
              label="Middle Name"
              name="middleName"
              placeholder="Santiago"
              isRequired={false}
              type="text"
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
            <CustomFormField
              label="Last Name"
              name="lastName"
              placeholder="Dela Cruz"
              isRequired
              type="text"
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
            <CustomFormField
              label="Suffix"
              name="suffix"
              placeholder="JR, SR, III"
              isRequired={false}
              type="text"
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
          </div>
          <div className="grid md:grid-cols-4 grid-cols-1 gap-3">
            <CustomFormField
              label="Date of Birth"
              name="birthdate"
              placeholder="dd/mm/yyyy"
              isRequired
              type="date"
              fieldType={FormFieldType.DATE_PICKER}
              calendarMode="birthdate"
              control={form.control}
              disabled={isLoading}
            />
            <CustomFormField
              label="Marital Status"
              name="maritalStatus"
              placeholder="Select your marital status"
              isRequired
              fieldType={FormFieldType.SELECT}
              control={form.control}
              selectOptions={[
                { label: "Single", value: "Single" },
                { label: "Married", value: "Married" },
                { label: "Separated", value: "Separated" },
                { label: "Widowed", value: "Widowed" },
              ]}
              disabled={isLoading}
            />
            <CustomFormField
              label="Age"
              name="age"
              placeholder="18"
              isRequired
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
            <CustomFormField
              label="Sex"
              name="sex"
              placeholder="Select your sex"
              isRequired
              fieldType={FormFieldType.SELECT}
              control={form.control}
              selectOptions={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
              ]}
              disabled={isLoading}
            />
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
            <CustomFormField
              label="Contact Number"
              name="contactNumber"
              type="phone"
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              disabled={isLoading}
              isRequired
            />
            <CustomFormField
              label="Birth Place (Hospital)"
              name="birthPlace"
              placeholder="UMC"
              isRequired
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
            <CustomFormField
              label="Facebook Name"
              name="facebookName"
              placeholder="Juan Dela Cruz"
              isRequired={false}
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
            <CustomFormField
              label="Email Address"
              name="email"
              placeholder="someone@example.com"
              isRequired
              type="email"
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
          </div>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
            <CustomFormField
              label="Occupation"
              name="occupation"
              placeholder="Web Developer"
              isRequired
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
            <CustomFormField
              label="Weight (kg)"
              name="weight"
              placeholder="60"
              isRequired
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
            <CustomFormField
              label="Height (cm)"
              name="height"
              placeholder="170"
              isRequired
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
          </div>
          <CustomFormField
            label="House/Unit/Block No., Street, Subdivision/Village"
            name="houseNumber"
            placeholder="Blk 1 Lot 2 Phase 3"
            isRequired
            fieldType={FormFieldType.INPUT}
            type="text"
            control={form.control}
            disabled={isLoading}
          />
          <CustomFormField
            label="Region"
            name="region"
            placeholder="Select your region"
            isRequired
            fieldType={FormFieldType.SELECT}
            control={form.control}
            selectOptions={regionOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            disabled={isLoading}
          />
          <CustomFormField
            label="Province"
            name="province"
            placeholder="Select your province"
            isRequired
            fieldType={FormFieldType.SELECT}
            control={form.control}
            selectOptions={provinceOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            disabled={isLoading || !selectedRegionName}
          />
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
            <CustomFormField
              label="Municipality"
              name="municipality"
              placeholder="Select your municipality"
              isRequired
              fieldType={FormFieldType.SELECT}
              control={form.control}
              selectOptions={municipalityOptions.map((option) => ({
                label: option,
                value: option,
              }))}
              disabled={isLoading || !selectedProvinceName}
            />
            <CustomFormField
              label="Barangay"
              name="barangay"
              placeholder="Select your barangay"
              isRequired
              fieldType={FormFieldType.SELECT}
              control={form.control}
              selectOptions={barangayOptions.map((option) => ({
                label: option,
                value: option,
              }))}
              disabled={isLoading || !selectedMunicipalityName}
            />
          </div>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
            <CustomFormField
              label="Father's Name"
              name="fatherName"
              placeholder="Juan Dela Cruz"
              isRequired={false}
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
            <CustomFormField
              label="Father's Occupation"
              name="fatherOccupation"
              placeholder="Painter"
              isRequired={false}
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
            <CustomFormField
              label="Father's Contact Number"
              name="fatherContactNumber"
              isRequired={false}
              fieldType={FormFieldType.PHONE_INPUT}
              type="phone"
              control={form.control}
              disabled={isLoading}
            />
          </div>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
            <CustomFormField
              label="Mother's Name"
              name="motherName"
              placeholder="Teresa Dela Cruz"
              isRequired={false}
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
            <CustomFormField
              label="Mother's Occupation"
              name="motherOccupation"
              placeholder="Cook"
              isRequired={false}
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
            <CustomFormField
              label="Mother's Contact Number"
              name="motherContactNumber"
              isRequired={false}
              fieldType={FormFieldType.PHONE_INPUT}
              type="phone"
              control={form.control}
              disabled={isLoading}
            />
          </div>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
            <CustomFormField
              label="Guardian's Name"
              name="guardianName"
              placeholder="Rosa Dela Cruz"
              isRequired={false}
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
            <CustomFormField
              label="Guardian's Relation (the patient is my?)"
              name="guardianRelation"
              placeholder="Aunt"
              isRequired={false}
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
            <CustomFormField
              label="Guardian's Contact Number"
              name="guardianContactNumber"
              isRequired={false}
              fieldType={FormFieldType.PHONE_INPUT}
              type="phone"
              control={form.control}
              disabled={isLoading}
            />
          </div>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
            <CustomFormField
              label="Doctor's Name"
              name="doctorName"
              placeholder="Dr. Arnold Tolentino"
              isRequired={false}
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
            <CustomFormField
              label="Doctor's Specialization"
              name="doctorSpecialization"
              placeholder="Dentist"
              isRequired={false}
              fieldType={FormFieldType.INPUT}
              control={form.control}
              disabled={isLoading}
            />
            <CustomFormField
              label="Doctor's Contact Number"
              name="doctorContactNumber"
              isRequired={false}
              fieldType={FormFieldType.PHONE_INPUT}
              type="phone"
              control={form.control}
              disabled={isLoading}
            />
          </div>
          <CustomFormField
            label="Referred by"
            name="referredBy"
            placeholder="Friend"
            isRequired={false}
            fieldType={FormFieldType.INPUT}
            control={form.control}
            disabled={isLoading}
          />

          <CustomFormField
            label="Reason for Consultation"
            name="consultationReason"
            placeholder="Toothache"
            isRequired
            fieldType={FormFieldType.INPUT}
            control={form.control}
            disabled={isLoading}
          />
          {!params.branchId && (
            <CustomFormField
              label="Branch"
              name="branchId"
              placeholder="Select your branch"
              isRequired
              fieldType={FormFieldType.SELECT}
              control={form.control}
              selectOptions={branches.map((option) => ({
                label: option.name,
                value: option.id,
              }))}
              disabled={isLoading}
            />
          )}
        </div>
        <div className="flex items-center justify-end mt-5">
          <div className="space-x-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {action}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PatientForm;
