"use client";

import React from "react";
import { SupplyColumn } from "./column";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddStockSchema } from "@/lib/validators";
import CustomFormField from "@/components/globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { User } from "@prisma/client";
import { getAllUsersExceptDentist } from "@/actions/user";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addStock } from "@/actions/supply";

const AddStockModal = ({ data }: { data: SupplyColumn }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [receiverOptions, setReceiverOptions] = React.useState<User[]>([]);
  const form = useForm<z.infer<typeof AddStockSchema>>({
    resolver: zodResolver(AddStockSchema),
    mode: "onChange",
    defaultValues: {
      supplyName: data.name,
      quantity: 1,
      receivedBy: "",
      remarks: "",
    },
  });

  React.useEffect(() => {
    const fetchUsers = async () => {
      const response = await getAllUsersExceptDentist();
      setReceiverOptions(response.data ?? []);
    };
    fetchUsers();
  }, []);

  const onSubmit = async (values: z.infer<typeof AddStockSchema>) => {
    setIsLoading(true);
    try {
      const response = await addStock(data.id, values);
      if (response.success) {
        setIsOpen(false);
        window.location.reload();
        toast.success(response.success);
      } else {
        toast.error(response.error || "An error occurred");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        title={`Add Stock to ${data.name}`}
        description={`Record new stock received for "${data.name}". Specify the quantity, date received, and other details.`}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 flex flex-col">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              label="Supply Name"
              control={form.control}
              name="supplyName"
              disabled
              isRequired
              placeholder="Supply Name"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              label="Received Quantity"
              control={form.control}
              name="quantity"
              disabled={isLoading}
              type="number"
              isRequired
              placeholder="Enter Received Quantity"
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              label="Received By"
              control={form.control}
              selectOptions={receiverOptions.map((receiver) => ({
                label: receiver.name,
                value: receiver.name,
              }))}
              name="receivedBy"
              disabled={isLoading}
              isRequired
              placeholder="Select Receiver"
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              label="Remarks"
              control={form.control}
              isRequired={false}
              name="remarks"
              disabled={isLoading}
              placeholder="Enter Remarks"
            />
            <Button disabled={isLoading} type="submit">
              {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </Modal>
      <Button size="sm" onClick={() => setIsOpen(true)}>
        Stock In
      </Button>
    </>
  );
};

export default AddStockModal;
