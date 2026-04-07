import { StatCard } from "../../../components/ui/StatCard";
import { Stats } from "./constants";
import Pagination from "../../../components/ui/Pagination";
import FilterBar from "./components/Filters";
import GradeTable from "./TableDiemSinhVien/Table";
import {
  DanhSachDiemThiProvider,
  useDanhSachDiemThiContext,
} from "./DanhSachDiemThiProvider";
import LichSuThaoTac from "./LichSuThaoTac";

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
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý điểm sinh viên
        </h1>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all">
          <span>+ Nhập điểm Excel</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Stats.map((item) => (
          <StatCard label={item.label} value={item.value} color={item.color} />
        ))}
      </div>

      <FilterBar />
      <GradeTable />

      {/* Pagination */}
      <Pagination
        currentPage={1}
        totalPages={4}
        onPageChange={(page) => console.log("Chuyển đến trang:", page)}
        pageSize={8}
        totalItems={100}
      />

      {/* Lịch sử thao tác sẽ được hiển thị dưới dạng Modal hoặc Drawer khi openLichSuThaoTac = true */}
      {openLichSuThaoTac && (
        <LichSuThaoTac onClose={() => setOpenLichSuThaoTac(false)} />
      )}
    </div>
  );
};
