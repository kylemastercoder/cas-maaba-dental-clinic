"use client";

import React from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Link from "next/link";

const HandlePrint = () => {
  const params = useParams();
  return (
    <>
      <Button asChild>
        <Link
          target="_blank"
          href={`/admin/patients/${params.patientId}/treatment-plan/pdf`}
        >
          <Printer className="mr-2 w-4 h-4" />
          Download PDF File
        </Link>
      </Button>
    </>
  );
};

export default HandlePrint;
