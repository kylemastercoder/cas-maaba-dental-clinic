"use client";

import { Button } from "@/components/ui/button";
import { UserColumn } from "./column";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, MoreHorizontal, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import AlertModal from "@/components/ui/alert-modal";
import { useActiveUser, useInactiveUser } from "@/data/user";

interface CellActionProps {
  data: UserColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  // const [initialData, setInitialData] = useState<UserColumn | null>(null);
  const onCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success("Data copied to the clipboard");
  };

  const { mutate: inactiveUser, isPending: isInactive } = useInactiveUser();
  const { mutate: activeUser, isPending: isActive } = useActiveUser();

  const onInactive = async () => {
    inactiveUser(data.id, {
      onSuccess: () => {
        setOpen(false);
        window.location.reload();
      },
    });
  };

  const onActive = async () => {
    activeUser(data.id, {
      onSuccess: () => {
        setOpen(false);
        window.location.reload();
      },
    });
  };

  // const onUpdate = () => {
  //   setInitialData(data);
  //   setFormOpen(true);
  // };

  return (
    <>
      <AlertModal
        title="Are you sure you want to set this user as inactive?"
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={isInactive}
        onConfirm={onInactive}
      />
      <AlertModal
        title="Are you sure you want to set this user as active?"
        isOpen={open2}
        onClose={() => setOpen2(false)}
        loading={isActive}
        onConfirm={onActive}
      />
      {/* {formOpen && (
        <UserForm
          roles={roles}
          initialData={initialData}
          onClose={() => setFormOpen(false)}
        />
      )} */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* <DropdownMenuItem onClick={onUpdate}>
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => onCopy(data.name)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {data.isActive === true ? (
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <ShieldAlert className="w-4 h-4 mr-2" />
              Set Inactive
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setOpen2(true)}>
              <ShieldCheck className="w-4 h-4 mr-2" />
              Set Active
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
