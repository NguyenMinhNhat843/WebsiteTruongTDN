import { useLopHocPhanContext } from "./LopHocPhanProvider";
import { Calendar, Grid, Plus } from "lucide-react";
import PageShell from "../../../components/ui/PageShell";
import DanhSachLopHocPhan from "./TableLopHocPhanList";
// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function LopHocPhanList() {
  const {
    setShowCreate,
    hocKysData,
    hocKyIdSelected,
    setHocKyIdSelected,
    lopHocPhans,
    isLoadingLopHocPhans,
  } = useLopHocPhanContext();

  const hocKyOptions = [
    { value: -1, label: "Tất cả học kỳ" }, // Hoặc value: "" tùy cấu trúc API của bạn
    ...(hocKysData?.map((hocKy) => ({
      value: hocKy.id, // Giả sử hocKy.id là number hoặc string
      label: `${hocKy.name}${hocKy.isCurrent ? " (Hiện tại)" : ""}`,
    })) ?? []),
  ];

  return (
    <PageShell
      title="Quản lý lớp học"
      sub="Quản lý danh sách các lớp học"
      icon={Grid}
      renderRight={
        <header className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 flex-nowrap">
            <div className="relative flex items-center w-56">
              <span className="absolute left-3 text-slate-400 pointer-events-none">
                <Calendar className="w-4 h-4" />
              </span>

              <select
                value={hocKyIdSelected ?? -1}
                onChange={(e) => setHocKyIdSelected(Number(e.target.value))}
                className="w-full pl-9 pr-10 py-2 bg-white border border-slate-200 
                  text-slate-700 text-sm rounded-lg 
                   shadow-sm appearance-none cursor-pointer transition-all duration-200 font-medium
                   hover:border-slate-300 hover:bg-slate-50/50
                   focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
              >
                {hocKyOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="text-slate-800 py-2 bg-white"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Nút thêm lớp: Thêm whitespace-nowrap để không bao giờ bị vỡ hàng */}
            <button
              onClick={() => setShowCreate(true)}
              className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] cursor-pointer text-white text-sm font-semibold 
                 px-4 py-2 rounded-lg shadow-sm shadow-blue-500/10 
                 transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Tạo lớp mới
            </button>
          </div>
        </header>
      }
    >
      <div className="flex bg-gray-50 font-sans text-gray-900 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1">
            <DanhSachLopHocPhan
              data={lopHocPhans || []}
              isLoading={isLoadingLopHocPhans}
            />
          </main>
        </div>
      </div>
    </PageShell>
  );
}
