/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { UserRegistrationSchema } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "../ui/modal";
import { useSaveUser } from "@/data/user";
import { Branch, Role } from "@prisma/client";
import { getAllBranches } from "@/actions/branch";
import { toast } from "sonner";

const UserForm = ({
  initialData,
  onClose,
  roles,
}: {
  initialData: any;
  onClose: () => void;
  roles: Role[];
}) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const title = initialData ? "Edit User" : "Add User";
  const description = initialData
    ? "Make sure to click save changes after you update the user."
    : "Please fill the required fields to add a new user.";
  const action = initialData ? "Save Changes" : "Save User";
  const form = useForm<z.infer<typeof UserRegistrationSchema>>({
    resolver: zodResolver(UserRegistrationSchema),
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          name: "",
          username: "",
          password: "",
          cpassword: "",
          role: "",
          branch: "",
        },
  });

  const { mutate: saveUser, isPending: isSaving } = useSaveUser(initialData);
  React.useEffect(() => {
    const fetchBranches = async () => {
      const response = await getAllBranches();
      if (response.data) {
        setBranches(response.data);
      } else {
        toast.error(response.error);
      }
    };
    fetchBranches();
  }, []);

  async function onSubmit(values: z.infer<typeof UserRegistrationSchema>) {
    saveUser(values, {
      onSuccess: () => {
        onClose();
        window.location.reload();
      },
    });
  }

  return (
    <>
      <Modal
        isOpen={true}
        onClose={onClose}
        title={title}
        description={description}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mx-auto grid flex-1 auto-rows-max gap-4">
              <div className="grid gap-4">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  placeholder="Juan Dela Cruz"
                  label="Name"
                  isRequired={true}
                  name="name"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  placeholder="juandelacruz123"
                  label="Username"
                  isRequired={true}
                  name="username"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  placeholder="--------"
                  label="Password"
                  type="password"
                  isRequired={true}
                  name="password"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  placeholder="--------"
                  label="Confirm Password"
                  type="password"
                  isRequired={true}
                  name="cpassword"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  placeholder="Select Branch"
                  selectOptions={branches.map((branch) => ({
                    value: branch.id,
                    label: branch.name,
                  }))}
                  label="Branch"
                  isRequired={true}
                  name="branch"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  selectOptions={roles.map((role) => ({
                    value: role.id,
                    label: role.name,
                  }))}
                  placeholder="Select Role"
                  label="Role"
                  isRequired={true}
                  name="role"
                  disabled={isSaving}
                />
                <Button type="submit" disabled={isSaving} size="sm">
                  {isSaving && <Loader className="animate-spin w-4 h-4 mr-2" />}
                  {action}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Modal>
    </>
  );
};

export default UserForm;
