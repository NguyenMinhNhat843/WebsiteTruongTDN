import { useTuyenSinhContext } from "../TuyenSinhProvider";
import TuyenSinhTable from "./TuyenSinhTable";
import DeleteModal from "../DeleteModal";
import { GraduationCap, Plus, X } from "lucide-react";
import PageShell from "../../../../components/ui/PageShell";
import StatsOverview from "../components/StatsOverview";
import ButtonAction from "../../../../components/ui/ButtonAction";
import FilterSection from "../components/FilterSection";

export default function DotTuyenSinhList() {
  const {
    deleteTarget,
    handleDelete,
    selectedRound,
    setDeleteTarget,
    setView,
    view,
    rounds,
    openFormCreate,
    setOpenFormCreate,
  } = useTuyenSinhContext();

  return (
    <PageShell
      title="Đợt tuyển sinh"
      sub="Quản lý toàn bộ các đợt tuyển sinh theo hệ đào tạo"
      icon={<GraduationCap size={26} />}
      renderRight={
        <ButtonAction
          onClick={() => setOpenFormCreate(true)}
          icon={<Plus size={16} />}
        >
          Tạo đợt mới
        </ButtonAction>
      }
    >
      <div className="min-h-screen bg-gray-50">
        <main className="flex-1 py-4">
          <div className="space-y-5">
            <StatsOverview />
            <FilterSection />

            <TuyenSinhTable rounds={rounds} />
          </div>

          {openFormCreate && (
            <div className="fixed inset-0 z-100 flex items-center justify-center">
              {/* Backdrop: Làm tối và mờ nền sau */}
              <div
                className="absolute inset-0 bg-gray-900/60 animate-in fade-in duration-300"
                onClick={() => setOpenFormCreate(false)} // Đóng khi click ra ngoài
              />

              {/* Modal Content Container */}
              <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl">
                {/* Nút đóng nhanh (X) ở góc trên bên phải */}
                <button
                  onClick={() => setOpenFormCreate(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Form chính */}
                {/* <CreateDotTuyenSinh onCancel={() => setOpenFormCreate(false)} /> */}
              </div>
            </div>
          )}
          {/* {view === "edit" && selectedRound && (
            <CreateDotTuyenSinh
              initial={selectedRound}
              onCancel={() => setView("detail")}
            />
          )} */}
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
    </PageShell>
  );
}
