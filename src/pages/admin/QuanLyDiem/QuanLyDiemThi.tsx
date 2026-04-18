import {
  DanhSachDiemThiProvider,
  useDanhSachDiemThiContext,
} from "./DanhSachDiemThiProvider";
import PageShell from "../../../components/ui/PageShell";
import { ClipboardCheck, FileSpreadsheet } from "lucide-react";
import ImportExcelModal from "./ModalNhapFileExcel";
import FilterSection from "./components/FIlterSection";
import StatsOverview from "./components/StatsOverview";
import DanhSachLopHoc from "./TableDanhSachLopHoc/TableDanhSachLopHoc";

export default function QuanLyDiemThi() {
  return (
    <DanhSachDiemThiProvider>
      <Inner />
    </DanhSachDiemThiProvider>
  );
}

const Inner = () => {
  const { openModalImportExcel, setOpenModalImportExcel } =
    useDanhSachDiemThiContext();
  return (
    <PageShell
      title="Quản lý điểm thi"
      icon={ClipboardCheck}
      sub="Năm học 2025 - 2026 | Học kỳ 2"
      renderRight={
        <div className="flex gap-2">
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg 
          text-sm font-medium flex items-center gap-2 shadow-sm shadow-emerald-200 transition-all active:scale-95"
            onClick={() => setOpenModalImportExcel(true)}
          >
            <FileSpreadsheet size={18} />
            <span>Nhập điểm Excel</span>
          </button>
        </div>
      }
    >
      <div className="pt-6">
        <StatsOverview />

        <FilterSection />

        <DanhSachLopHoc />

        {openModalImportExcel && (
          <ImportExcelModal onClose={() => setOpenModalImportExcel(false)} />
        )}
      </div>
    </PageShell>
  );
};
