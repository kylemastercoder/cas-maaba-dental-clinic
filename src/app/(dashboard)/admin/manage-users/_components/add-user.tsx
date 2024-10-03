"use client";

import UserForm from "@/components/modals/user-modal";
import { Button } from "@/components/ui/button";
import { IconCirclePlus } from "@tabler/icons-react";
import React, { useState } from "react";

const AddUser = () => {
  const [openUserModal, setOpenUserModal] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpenUserModal(true)}
        size="sm"
        className="h-7 gap-1"
      >
        <IconCirclePlus className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add User
        </span>
      </Button>

      {openUserModal && (
        <UserForm
          initialData={null}
          onClose={() => setOpenUserModal(false)}
        />
      )}
    </>
  );
};

export default AddUser;
