import { TABS } from "./constants";
import {
  LopHocVaKhoaHocProvider,
  useLopHocVaKhoaHocContext,
} from "./LopHocVaKhoaHocProvider";
import CreatePanel from "./Create/CreateForm";
import DetailModal from "./One/ModalOne";
import { Grid } from "lucide-react";
import Table from "./Table/Table";
import PageShell from "../../../components/ui/PageShell";
import StatsOverview from "./components/StatsOverview";
import FilterSection from "./components/FilterSection";
import { SelectOption } from "../../../components/ui/Form/SelectOption";

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function LopHocVaKhoaHoc() {
  return (
    <LopHocVaKhoaHocProvider>
      <Inner />
    </LopHocVaKhoaHocProvider>
  );
}
function Inner() {
  const {
    activeTab,
    detail,
    handleTabChange,
    setShowCreate,
    setDetail,
    tabCounts,
    showCreate,
  } = useLopHocVaKhoaHocContext();

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

            {/* TABS */}
            <div className="flex gap-1 bg-gray-200/50 p-1.5 rounded-xl w-fit mb-6 backdrop-blur-sm">
              {TABS.map((t) => {
                const isActive = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => handleTabChange(t.key)}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group
                          ${
                            isActive
                              ? "bg-white text-blue-600 shadow-md translate-y-px"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {t.label}
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full border 
                              ${
                                isActive
                                  ? "bg-blue-50 border-blue-100 text-blue-500"
                                  : "bg-gray-200 border-transparent text-gray-500"
                              }`}
                      >
                        {tabCounts[t.key]}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filter section */}
            <FilterSection />

            {/* TABLE */}
            <Table className="mt-6" />
          </main>
        </div>

        {/* MODALS */}
        <CreatePanel open={showCreate} onClose={() => setShowCreate(false)} />
        <DetailModal row={detail} onClose={() => setDetail(null)} />
      </div>
    </PageShell>
  );
}
