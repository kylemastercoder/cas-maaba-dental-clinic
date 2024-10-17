"use client";

import ServiceForm from "@/components/modals/service-modal";
import { Button } from "@/components/ui/button";
import { IconCirclePlus } from "@tabler/icons-react";
import React, { useState } from "react";

const AddService = () => {
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
          Add Service
        </span>
      </Button>

      {openModal && (
        <ServiceForm
          initialData={null}
          onClose={() => setOpenModal(false)}
        />
      )}
    </>
  );
};

export default AddService;
