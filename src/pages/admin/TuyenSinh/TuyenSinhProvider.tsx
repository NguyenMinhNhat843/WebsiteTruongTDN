import { useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";
import type { AdmissionRound, AdmissionStatus, TrainingSystem } from "./type";
import { MOCK_DATA } from "./mockData";
import { useNavigate } from "react-router-dom";

export type View = "list" | "detail" | "create" | "edit";

export const [TuyenSinhProvider, useTuyenSinhContext] = createContextProvider(
  () => {
    const navigate = useNavigate();
    const [openFormCreate, setOpenFormCreate] = useState(false);
    const [rounds, setRounds] = useState<AdmissionRound[]>(MOCK_DATA);
    const [view, setView] = useState<View>("list");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<AdmissionStatus | "all">(
      "all",
    );
    const [systemFilter, setSystemFilter] = useState<TrainingSystem | "all">(
      "all",
    );
    const [deleteTarget, setDeleteTarget] = useState<AdmissionRound | null>(
      null,
    );

    const selectedRound = rounds.find((r) => r.id === selectedId) ?? null;

    const filteredRounds = rounds.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (systemFilter !== "all" && r.trainingSystem !== systemFilter)
        return false;
      return true;
    });

    const handleCreate = (data: Omit<AdmissionRound, "id" | "createdAt">) => {
      const newRound: AdmissionRound = {
        ...data,
        id: String(Date.now()),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setRounds((prev) => [newRound, ...prev]);
      setView("list");
    };

    const handleEdit = (data: Omit<AdmissionRound, "id" | "createdAt">) => {
      if (!selectedId) return;
      setRounds((prev) =>
        prev.map((r) => (r.id === selectedId ? { ...r, ...data } : r)),
      );
      setView("detail");
    };

    const handleDelete = () => {
      if (!deleteTarget) return;
      setRounds((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
      setView("list");
      setSelectedId(null);
    };

    return {
      // function handler
      handleCreate,
      handleDelete,
      handleEdit,

      filteredRounds,
      selectedRound,

      // view state
      deleteTarget,
      setDeleteTarget,
      systemFilter,
      setSystemFilter,
      statusFilter,
      setStatusFilter,
      view,
      setView,
      rounds,
      setRounds,
      selectedId,
      setSelectedId,

      navigate,
      openFormCreate,
      setOpenFormCreate,
    };
  },
);
