import { create } from "zustand";

export const useApprovalClicked = create(set => ({
  clicked: false,
  setClicked: clicked => set({ clicked }),
}));
