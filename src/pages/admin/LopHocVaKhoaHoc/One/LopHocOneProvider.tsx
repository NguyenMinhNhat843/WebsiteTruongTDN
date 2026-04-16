import { useState } from "react";
import { createContextProvider } from "../../../../util/createContextProvider";

export const [LopHocOneProvider, useLopHocOneContext] = createContextProvider(
  () => {
    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState<
      "info" | "students" | "schedule"
    >("info");
    const onClickUpdate = () => {
      setEditMode((prev) => !prev);
      setActiveTab("info");
    };

    return {
      editMode,
      setEditMode,
      activeTab,
      setActiveTab,
      onClickUpdate,
    };
  },
);
