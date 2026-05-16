import { useLopHocPhanContext } from "./LopHocPhanProvider";
import CreatePanel from "./Create/CreateForm";
import DetailModal from "./One/ModalOne";
import { Calendar, Grid } from "lucide-react";
import PageShell from "../../../components/ui/PageShell";
import StatsOverview from "./components/StatsOverview";
import DanhSachLopHocPhan from "./Table/Table";
// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function LopHocPhanList() {
  const {
    detail,
    setShowCreate,
    setDetail,
    showCreate,
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
        <header className="flex items-center justify-between shrink-0 py-4">
          {/* Thanh công cụ điều khiển bên phải: Đảm bảo luôn nằm trên 1 hàng */}
          <div className="flex items-center gap-3 flex-nowrap">
            {/* Bọc Select trong một div relative để chèn Icon tùy biến */}
            <div className="relative flex items-center w-56">
              {/* Icon Lịch ở đầu Select */}
              <span className="absolute left-3 text-slate-400 pointer-events-none">
                <Calendar className="w-4 h-4" />
              </span>

              <select
                value={hocKyIdSelected ?? -1}
                onChange={(e) => setHocKyIdSelected(Number(e.target.value))}
                className="w-full pl-9 pr-10 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg 
                   shadow-sm appearance-none cursor-pointer transition-all duration-200
                   font-medium
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

              {/* Mũi tên Dropdown tùy chỉnh thay cho mũi tên mặc định của trình duyệt */}
              <span className="absolute right-3 pointer-events-none text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>

            {/* Nút thêm lớp: Thêm whitespace-nowrap để không bao giờ bị vỡ hàng */}
            <button
              onClick={() => setShowCreate(true)}
              className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] cursor-pointer text-white text-sm font-semibold 
                 px-4 py-2 rounded-lg shadow-sm shadow-blue-500/10 
                 transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Tạo lớp mới
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
