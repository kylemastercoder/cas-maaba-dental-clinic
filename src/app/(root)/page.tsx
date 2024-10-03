"use client";

import { useBranchModal } from "@/hooks/use-branch-modal";
import { useEffect } from "react";

const SetupPage = () => {
  const onOpen = useBranchModal((state) => state.onOpen);
  const isOpen = useBranchModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};

export default SetupPage;
