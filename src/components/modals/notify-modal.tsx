"use client";

import React, { useState } from "react";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { Modal } from "../ui/modal";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NotifySchema } from "@/lib/validators";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sendEmail } from "@/lib/send-email";

const NotifyModal = ({
  isOpen,
  onClose,
  patientName,
  patientEmail,
}: {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientEmail: string;
}) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof NotifySchema>>({
    resolver: zodResolver(NotifySchema),
    mode: "onChange",
    defaultValues: {
      name: patientName,
      email: patientEmail,
      title: "",
      description: "",
      followUpDate: "",
    },
  });

  async function onSubmit(values: z.infer<typeof NotifySchema>) {
    try {
      setLoading(true);
      const response = await sendEmail(values);
      if (response.success) {
        toast.success(response.message);
        onClose();
        window.location.reload();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Modal
      title="Submit Notification"
      description="Notify your patient via email about their upcoming appointment."
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mx-auto grid flex-1 auto-rows-max gap-4">
            <div className="grid gap-4">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                placeholder="Enter name"
                label="Patient"
                isRequired={true}
                name="name"
                disabled
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                placeholder="Enter email"
                label="Email Address"
                isRequired={true}
                name="email"
                disabled
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                placeholder="Enter title"
                label="Title"
                isRequired={true}
                name="title"
                disabled={loading}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                placeholder="Enter description"
                label="Description"
                isRequired={true}
                name="description"
                disabled={loading}
              />
              <CustomFormField
                label="Follow-up Date"
                name="followUpDate"
                placeholder="dd/mm/yyyy"
                isRequired
                type="date"
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                disabled={loading}
              />
              <Button type="submit" disabled={loading} size="sm">
                {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                Send Notification
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default NotifyModal;
