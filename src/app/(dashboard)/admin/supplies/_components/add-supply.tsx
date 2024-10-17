"use client";

import SupplyForm from "@/components/modals/supply-modal";
import { Button } from "@/components/ui/button";
import { IconCirclePlus } from "@tabler/icons-react";
import React, { useState } from "react";

const AddSupply = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpenModal(true)}
        size="sm"
        className="h-7 gap-1"
      >
        <IconCirclePlus className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Supply
        </span>
      </Button>

      {openModal && (
        <SupplyForm
          initialData={null}
          onClose={() => setOpenModal(false)}
        />
      )}
    </>
  );
};

export default AddSupply;
