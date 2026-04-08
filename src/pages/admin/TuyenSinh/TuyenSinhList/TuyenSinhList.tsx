import type { AdmissionStatus, TrainingSystem } from "../type";
import { STATUS_LABELS, TRAINING_SYSTEM_LABELS } from "../constants";
import { fillRate } from "../helpers";
import { StatCard } from "../../../../components/ui/StatCard";
import AdmissionForm from "../TuyenSinhCreate/TuyenSInhCreateForm";
import { useTuyenSinhContext } from "../TuyenSinhProvider";
import TuyenSinhTable from "./TuyenSinhTable";
import DeleteModal from "../DeleteModal";

export default function DotTuyenSinhList() {
  const {
    deleteTarget,
    handleCreate,
    handleDelete,
    handleEdit,
    selectedRound,
    setDeleteTarget,
    setStatusFilter,
    setSystemFilter,
    setView,
    statusFilter,
    systemFilter,
    view,
    rounds,
  } = useTuyenSinhContext();

  const totalQuota = rounds
    .filter((r) => r.status === "open")
    .reduce((s, r) => s + r.totalQuota, 0);
  const totalRegistered = rounds
    .filter((r) => r.status === "open")
    .reduce((s, r) => s + r.totalRegistered, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1 p-5 sm:p-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Quản lý đợt tuyển sinh
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Quản lý toàn bộ các đợt tuyển sinh theo hệ đào tạo
            </p>
          </div>
        </div>

        {/* Views */}
        <div className="space-y-5">
          {/* Top stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Tổng đợt chỉ tiêu",
                value: rounds.length,
              },
              {
                label: "Chỉ tiêu đang mở",
                value: totalQuota.toLocaleString(),
                sub: `${fillRate(totalRegistered, totalQuota)}% lấp đầy`,
              },
              {
                label: "Đã đăng ký (đang mở)",
                value: totalRegistered.toLocaleString(),
                sub: `${fillRate(totalRegistered, totalQuota)}% lấp đầy`,
              },
            ].map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                description={stat.sub}
              />
            ))}
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-0 flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as AdmissionStatus | "all")
                }
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                {(
                  Object.entries(STATUS_LABELS) as [AdmissionStatus, string][]
                ).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <select
                value={systemFilter}
                onChange={(e) =>
                  setSystemFilter(e.target.value as TrainingSystem | "all")
                }
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả hệ đào tạo</option>
                {(
                  Object.entries(TRAINING_SYSTEM_LABELS) as [
                    TrainingSystem,
                    string,
                  ][]
                ).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5">
              <span className="text-base leading-none">+</span> Tạo đợt mới
            </button>
          </div>

          <TuyenSinhTable rounds={rounds} />
        </div>

        {view === "create" && (
          <AdmissionForm
            onSave={handleCreate}
            onCancel={() => setView("list")}
          />
        )}

        {view === "edit" && selectedRound && (
          <AdmissionForm
            initial={selectedRound}
            onSave={handleEdit}
            onCancel={() => setView("detail")}
          />
        )}
      </main>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
