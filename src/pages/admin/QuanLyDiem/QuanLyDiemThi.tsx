import Pagination from "../../../components/ui/Pagination";
import FilterBar from "./components/Filters";
import GradeTable from "./TableDiemSinhVien/Table";
import {
  DanhSachDiemThiProvider,
  useDanhSachDiemThiContext,
} from "./DanhSachDiemThiProvider";
import LichSuThaoTac from "./LichSuThaoTac";
import StatsOverview from "./components/StatsOverview";
import PageShell from "../../../components/ui/PageShell";
import { ClipboardCheck, FileSpreadsheet } from "lucide-react";

export default function QuanLyDiemThi() {
  return (
    <DanhSachDiemThiProvider>
      <Inner />
    </DanhSachDiemThiProvider>
  );
}

const Inner = () => {
  const { openLichSuThaoTac, setOpenLichSuThaoTac } =
    useDanhSachDiemThiContext();
  return (
    <PageShell
      title="Quản lý điểm thi"
      icon={<ClipboardCheck size={26} />}
      sub="Năm học 2025 - 2026 | Học kỳ 2"
      renderRight={
        <div className="flex gap-2">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm shadow-emerald-200 transition-all active:scale-95">
            <FileSpreadsheet size={18} />
            <span>Nhập điểm Excel</span>
          </button>
        </div>
      }
    >
      <div className="p-6 bg-gray-50 min-h-screen font-sans">
        <StatsOverview />

        <FilterBar />
        <GradeTable />

        {/* Pagination */}
        <Pagination
          currentPage={1}
          onPageChange={(page) => console.log("Chuyển đến trang:", page)}
          pageSize={8}
          totalItems={100}
        />

        {/* Lịch sử thao tác sẽ được hiển thị dưới dạng Modal hoặc Drawer khi openLichSuThaoTac = true */}
        {openLichSuThaoTac && (
          <LichSuThaoTac onClose={() => setOpenLichSuThaoTac(false)} />
        )}
      </div>
    </PageShell>
  );
};
