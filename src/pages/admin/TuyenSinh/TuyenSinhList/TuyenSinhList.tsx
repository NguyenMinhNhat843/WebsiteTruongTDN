import { fillRate } from "../helpers";
import { StatCard } from "../../../../components/ui/StatCard";
import AdmissionForm from "../TuyenSinhCreate/TuyenSInhCreateForm";
import { useTuyenSinhContext } from "../TuyenSinhProvider";
import TuyenSinhTable from "./TuyenSinhTable";
import DeleteModal from "../DeleteModal";
import ToolBar from "./ToolBar";
import { X } from "lucide-react";

export default function DotTuyenSinhList() {
  const {
    deleteTarget,
    handleCreate,
    handleDelete,
    handleEdit,
    selectedRound,
    setDeleteTarget,
    setView,
    view,
    rounds,
    openFormCreate,
    setOpenFormCreate,
  } = useTuyenSinhContext();

  const totalQuota = rounds
    .filter((r) => r.status === "open")
    .reduce((s, r) => s + r.totalQuota, 0);
  const totalRegistered = rounds
    .filter((r) => r.status === "open")
    .reduce((s, r) => s + r.totalRegistered, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1 p-5 sm:p-8">
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

        <div className="space-y-5">
          {/* Top stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Tổng đợt chỉ tiêu",
                value: rounds.length,
                color: "#6366f1", // Indigo
              },
              {
                label: "Chỉ tiêu đang mở",
                value: totalQuota.toLocaleString(),
                sub: `${fillRate(totalRegistered, totalQuota)}% lấp đầy`,
                color: "#0ea5e9", // Sky Blue
              },
              {
                label: "Đã đăng ký",
                value: totalRegistered.toLocaleString(),
                sub: `${fillRate(totalRegistered, totalQuota)}% lấp đầy`,
                color: "#f59e0b", // Amber
              },
              {
                label: "Hồ sơ đã duyệt",
                value: 100,
                sub: "75% tiến độ",
                color: "#10b981", // Emerald
              },
            ].map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                description={stat.sub}
                color={stat.color}
              />
            ))}
          </div>

          <ToolBar />

          <TuyenSinhTable rounds={rounds} />
        </div>

        {openFormCreate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop: Làm tối và mờ nền sau */}
            <div
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setOpenFormCreate(false)} // Đóng khi click ra ngoài
            />

            {/* Modal Content Container */}
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl shadow-black/20 animate-in zoom-in-95 duration-300">
              {/* Nút đóng nhanh (X) ở góc trên bên phải */}
              <button
                onClick={() => setOpenFormCreate(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Form chính */}
              <AdmissionForm
                onSave={handleCreate}
                onCancel={() => setOpenFormCreate(false)}
              />
            </div>
          </div>
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
