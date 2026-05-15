import { useLopHocPhanContext } from "./LopHocPhanProvider";
import CreatePanel from "./Create/CreateForm";
import DetailModal from "./One/ModalOne";
import { Grid } from "lucide-react";
import PageShell from "../../../components/ui/PageShell";
import StatsOverview from "./components/StatsOverview";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import DanhSachLopHocPhan from "./Table/Table";
// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function LopHocPhanList() {
  const {
    detail,
    setShowCreate,
    setDetail,
    showCreate,

    lopHocPhans,
    isLoadingLopHocPhans,
  } = useLopHocPhanContext();

  return (
    <PageShell
      title="Quản lý lớp học"
      sub="Quản lý danh sách các lớp học"
      icon={Grid}
      renderRight={
        <header className="bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <SelectOption
              containerClassName="w-fit" // Giữ kích thước gọn gàng
              className="text-xs text-gray-600 border-gray-500"
              defaultValue="HK2-2024-2025"
              options={[
                { value: "HK1-2026", label: "HK1 • 2026" },
                { value: "HK2-2026", label: "HK2 • 2026" },
                { value: "HK1-2025", label: "HK1 • 2025" },
                { value: "HK2-2024-2025", label: "HK2 • 2024–2025" },
              ]} // Danh sách options
            />
            <button
              onClick={() => setShowCreate(true)}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Tạo lớp mới
            </button>
          </div>
        </header>
      }
    >
      <div className="flex bg-gray-50 font-sans text-gray-900 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 py-5">
            {/* STATS */}
            <StatsOverview />

            <div className="pt-8">
              <DanhSachLopHocPhan
                data={lopHocPhans || []}
                isLoading={isLoadingLopHocPhans}
              />
            </div>
          </main>
        </div>

        {/* MODALS */}
        <CreatePanel open={showCreate} onClose={() => setShowCreate(false)} />
        <DetailModal row={detail} onClose={() => setDetail(null)} />
      </div>
    </PageShell>
  );
}
