/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import { PatientColumn } from "./column";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  BriefcaseMedical,
  Copy,
  Edit,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import AlertModal from "@/components/ui/alert-modal";
import { useParams, useRouter } from "next/navigation";
import NotifyModal from "@/components/modals/notify-modal";
import { useDeletePatient } from "@/data/patient";
import { Role, User } from "@prisma/client";

export interface UserWithRoles extends User {
  role: Role;
}
interface CellActionProps {
  data: PatientColumn;
  user?: UserWithRoles;
}

export const CellAction: React.FC<CellActionProps> = ({ data, user }) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [openNotifyModal, setOpenNotifyModal] = useState(false);
  const onCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success("Data copied to the clipboard");
  };

  const { mutate: deleteUser, isPending: isDeleting } = useDeletePatient();

  const onDelete = async () => {
    deleteUser(data.id, {
      onSuccess: () => {
        setOpen(false);
        window.location.reload();
      },
    });
  };

  useEffect(() => {
    const createdAtDate = new Date(data.createdAt);
    const sixYearsAgo = new Date();
    sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6);

    if (createdAtDate <= sixYearsAgo) {
      onDelete();
    }
  }, [data.createdAt]);

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={isDeleting}
        onConfirm={onDelete}
      />

      <NotifyModal
        patientName={data.name}
        patientEmail={data.email}
        isOpen={openNotifyModal}
        onClose={() => setOpenNotifyModal(false)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `${
                  params.branchId
                    ? `/${params.branchId}/patients/${data.id}/treatment-plan`
                    : `/admin/patients/${data.id}/treatment-plan`
                }`
              )
            }
          >
            <BriefcaseMedical className="w-4 h-4 mr-2" />
            Dental Record
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenNotifyModal(true)}>
            <Bell className="w-4 h-4 mr-2" />
            Notify for Follow-up
          </DropdownMenuItem>
          {(user?.role.name === "Branch Head" ||
            user?.role.name === "Front Desk" ||
            user?.role.name === "Administrator") && (
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `${
                    params.branchId
                      ? `/${params.branchId}/patients/${data.id}`
                      : `/admin/patients/${data.id}`
                  }`
                )
              }
            >
              <Edit className="w-4 h-4 mr-2" />
              Update
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => onCopy(data.name)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
