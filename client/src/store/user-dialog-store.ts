import { create } from "zustand";

export type userDialogType = {
  showDialogOf: "fileLimit" | "invalidFile" | "attachLimit" | "";
};

const userDialogStore = create<userDialogType>(() => ({
  showDialogOf: "",
}));

export default userDialogStore;
