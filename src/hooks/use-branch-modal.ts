import { create } from "zustand";

interface useBranchModalInterface {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useBranchModal = create<useBranchModalInterface>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
