import { useMemo, useState } from "react";
import { createContextProvider } from "../../../util/createContextProvider";
import { calcBreakdown, totalHours } from "./chuongTrinhKhung.helpers";
import type {
  CreateFormState,
  CurriculumFramework,
  EduSystem,
  Status,
} from "./chuongTrinhKhung.type";
import { mockData } from "./chuongTrinhKhung.mockData";

export const [ChuongTrinhKhungProvider, useChuongTrinhKhungContext] =
  createContextProvider(() => {
    const [frameworks, setFrameworks] =
      useState<CurriculumFramework[]>(mockData);
    const [search, setSearch] = useState("");
    const [filterSys, setFilterSys] = useState<EduSystem | "all">("all");
    const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"overview" | "modules">(
      "overview",
    );
    const [showForm, setShowForm] = useState(false);
    const [editTarget, setEditTarget] = useState<CurriculumFramework | null>(
      null,
    );

    const filtered = useMemo(
      () =>
        frameworks.filter((f) => {
          const q = search.toLowerCase();
          const ms =
            !search ||
            [f.name, f.code, f.major, f.department].some((s) =>
              s.toLowerCase().includes(q),
            );
          return (
            ms &&
            (filterSys === "all" || f.eduSystem === filterSys) &&
            (filterStatus === "all" || f.status === filterStatus)
          );
        }),
      [frameworks, search, filterSys, filterStatus],
    );

    const selected = frameworks.find((f) => f.id === selectedId) ?? null;

    const stats = useMemo(
      () => ({
        total: frameworks.length,
        active: frameworks.filter((f) => f.status === "active").length,
        draft: frameworks.filter((f) => f.status === "draft").length,
        systems: new Set(frameworks.map((f) => f.eduSystem)).size,
      }),
      [frameworks],
    );

    function handleSave(form: CreateFormState) {
      const now = new Date().toISOString().slice(0, 10);
      if (editTarget) {
        setFrameworks((p) =>
          p.map((f) =>
            f.id === editTarget.id ? { ...f, ...form, updatedAt: now } : f,
          ),
        );
      } else {
        setFrameworks((p) => [
          {
            id: Date.now().toString(),
            ...form,
            terms: [],
            createdAt: now,
            updatedAt: now,
          },
          ...p,
        ]);
      }
      setShowForm(false);
      setEditTarget(null);
    }

    function handleDelete(id: string) {
      if (!confirm("Xóa chương trình khung này?")) return;
      setFrameworks((p) => p.filter((f) => f.id !== id));
      if (selectedId === id) setSelectedId(null);
    }

    const handleOpenFormUpdateModal = () => {
      setEditTarget(selected);
      setShowForm(true);
    };

    const handleApplyFramework = () => {
      if (!selected) return;
      setFrameworks((p) =>
        p.map((f) => (f.id === selected.id ? { ...f, status: "active" } : f)),
      );
    };

    const breakdown = selected ? calcBreakdown(selected) : null;
    const hrs = selected ? totalHours(selected) : 0;

    return {
      frameworks,
      setFrameworks,
      search,
      setSearch,
      filterSys,
      setFilterSys,
      filterStatus,
      setFilterStatus,
      selectedId,
      setSelectedId,

      handleOpenFormUpdateModal,
      handleApplyFramework,

      filtered,
      selected,
      stats,

      activeTab,
      setActiveTab,
      showForm,
      setShowForm,
      editTarget,
      setEditTarget,
      handleSave,
      handleDelete,
      breakdown,
      hrs,
    };
  });
