"use client";

import { Button } from "@/components/ui/button";
import { TreatmentColumn } from "./column";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import AlertModal from "@/components/ui/alert-modal";
import UpdateDentalHistoryModal from "@/components/modals/update-treatment-modal";
import { useDeleteTreatmentPlan } from "@/data/treatment-plan";
import { Role, User } from "@prisma/client";

export interface UserWithRoles extends User {
  role: Role;
}
interface CellActionProps {
  data: TreatmentColumn;
  user?: UserWithRoles;
}

export const CellAction: React.FC<CellActionProps> = ({ data, user }) => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const { mutate: treatmentPlan, isPending: isDeleting } =
    useDeleteTreatmentPlan();

  const onDelete = async () => {
    treatmentPlan(data.id, {
      onSuccess: () => {
        setOpen(false);
        window.location.reload();
      },
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={isDeleting}
        onConfirm={onDelete}
      />
      <UpdateDentalHistoryModal
        initialData={data}
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
      />
      {user?.role.name !== "Dentist" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setOpenEdit(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Update
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};
