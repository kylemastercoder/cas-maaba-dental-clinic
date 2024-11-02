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
          maritalStatus: "",
          occupation: "",
          contactNumber: "",
          branchId: Array.isArray(params.branchId)
            ? params.branchId[0]
            : params.branchId ?? "",
        },
  });

  const { mutate: savePatient, isPending: isLoading } =
    useSavePatient(initialData);

  async function onSubmit(values: z.infer<typeof PatientSchema>) {
    savePatient(values, {
      onSuccess: () => router.push(`${params.branchId ? `/${params.branchId}/patients` : "/admin/patients"}`),
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
            label="Phone Number"
            name="contactNumber"
            type="phone"
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            disabled={isLoading}
            isRequired
          />
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
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
              label="Occupation"
              name="occupation"
              placeholder="Web Developer"
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
            disabled
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
            disabled
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
              disabled={isLoading}
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
