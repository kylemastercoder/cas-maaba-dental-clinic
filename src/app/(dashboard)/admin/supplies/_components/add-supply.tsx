"use client";

import { getAllBranches } from "@/actions/branch";
import { getAllUnits } from "@/actions/unit";
import SupplyForm from "@/components/modals/supply-modal";
import { Button } from "@/components/ui/button";
import { Branch, Units } from "@prisma/client";
import { IconCirclePlus } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

const AddSupply = () => {
  const [openModal, setOpenModal] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [units, setUnits] = useState<Units[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      const response = await getAllBranches();
      console.log("Fetched branches:", response);
      setBranches(response?.data || []);
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchUnits = async () => {
      const response = await getAllUnits();
      console.log("Fetched units:", response);
      setUnits(response?.data || []);
    };
    fetchUnits();
  }, []);

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
          branches={branches}
          units={units}
          initialData={null}
          onClose={() => setOpenModal(false)}
        />
      )}
    </>
  );
};

export default AddSupply;
