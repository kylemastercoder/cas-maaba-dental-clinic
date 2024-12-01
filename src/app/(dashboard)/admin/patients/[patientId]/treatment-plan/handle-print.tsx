"use client";

import React from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

const HandlePrint = () => {
  const handlePrint = () => {
    window.print();
  };
  return (
    <>
      <Button onClick={handlePrint} className="no-print">
        <Printer className="mr-2 w-4 h-4" />
        Download PDF File
      </Button>
    </>
  );
};

export default HandlePrint;
