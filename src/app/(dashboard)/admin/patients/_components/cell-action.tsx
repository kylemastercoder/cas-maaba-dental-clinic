"use client";

import { Button } from "@/components/ui/button";
import { PatientColumn } from "./column";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  BriefcaseMedical,
  Copy,
  Edit,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import AlertModal from "@/components/ui/alert-modal";
import { useDeleteUser } from "@/data/user";
import { useRouter } from "next/navigation";
import NotifyModal from "@/components/modals/notify-modal";

interface CellActionProps {
  data: PatientColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openNotifyModal, setOpenNotifyModal] = useState(false);
  const onCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success("Data copied to the clipboard");
  };

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const onDelete = async () => {
    deleteUser(data.id, {
      onSuccess: () => {
        setOpen(false);
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
              router.push(`/admin/patients/${data.id}/treatment-plan`)
            }
          >
            <BriefcaseMedical className="w-4 h-4 mr-2" />
            Treatment Plan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenNotifyModal(true)}>
            <Bell className="w-4 h-4 mr-2" />
            Notify for Follow-up
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/patients/${data.id}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(data.name)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
