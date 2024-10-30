"use client";

import { getAllBranches } from "@/actions/branch";
import ServiceForm from "@/components/modals/service-modal";
import { Button } from "@/components/ui/button";
import { Branch } from "@prisma/client";
import { IconCirclePlus } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

const AddService = () => {
  const [openModal, setOpenModal] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([])
  useEffect(() => {
    const fetchBranches = async () => {
      const response = await getAllBranches();
      setBranches(response?.data || []);
    }
    fetchBranches();
  }, [])
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
          branches={branches}
        />
      )}
    </>
  );
};

export default AddService;
